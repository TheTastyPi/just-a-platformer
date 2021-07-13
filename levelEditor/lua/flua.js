const lua = fengari.lua
const lauxlib = fengari.lauxlib
const lualib = fengari.lualib

const {
  LUA_TBOOLEAN,
  LUA_TFUNCTION,
  LUA_TNIL,
  LUA_TNUMBER,
  LUA_TSTRING,
  LUA_TTABLE,
  lua_gettop,
  lua_isnone,
  lua_pop,
  lua_createtable,
  lua_next,
  lua_pushboolean,
  lua_pushjsfunction,
  lua_pushnil,
  lua_pushnumber,
  lua_pushstring,
  lua_rawlen,
  lua_rawgeti,
  lua_rawseti,
  lua_rawget,
  lua_rawset,
  lua_setglobal,
  lua_getglobal,
  lua_toboolean,
  lua_tojsstring,
  lua_tonumber,
  lua_tointeger,
  lua_type
} = lua

// utils
function fluaRun(code, getglobals) {
  fluaRunWithGlobals({}, code, getglobals)
}

function fluaRunWithGlobals(globals, code, getglobals = []) {
  const L = lauxlib.luaL_newstate()
  lualib.luaL_openlibs(L)
  flua_setglobals(L, globals)
  let bad = lauxlib.luaL_loadstring(L, fengari.to_luastring(code))
  if (bad) {
    throw new Error(bad)
  }
  let err = lua.lua_pcall(L, 0, 0, 0)
  if (err) {
    let errmsg = lua_tojsstring(L, -1)
    lua_pop(L, 1)
    throw new Error(errmsg)
  }
  return flua_getglobals(L, getglobals)
}

function flua_setglobals(L, globals) {
  for (let k in globals) {
    let v = globals[k]
    flua_pushany(L, v)
    lua_setglobal(L, k)
  }
}

function flua_getglobals(L, names) {
  var globals = {}
  for (let i = 0; i < names.length; i++) {
    let name = names[i]
    lua_getglobal(L, name)
    let v = flua_readany(L, -1)
    globals[name] = v
    lua_pop(L, 1)
  }
  return globals
}

function flua_getfullstack(L) {
  values = []
  for (let i = 1; i <= lua_gettop(L); i++) {
    let v = flua_readany(L, i)
    values.push(v)
  }
  return values
}

// read stuff
function flua_readany(L, pos) {
  switch (lua_type(L, pos)) {
    case LUA_TNIL:
      return null
    case LUA_TNUMBER:
      return lua_tonumber(L, pos)
    case LUA_TBOOLEAN:
      return lua_toboolean(L, pos)
    case LUA_TSTRING:
      let x = lua_tojsstring(L, pos)
      return x
    case LUA_TTABLE:
      return flua_readtable(L, pos)
  }
  return null
}

function flua_readtable(L, pos) {
  if (pos < 0) {
    pos = lua_gettop(L) + 1 + pos
  }

  var object = {}
  var slice = []

  var isArray = true
  let size = lua_rawlen(L, pos)
  if (size === 0) {
    isArray = false
  } else {
    slice = new Array(size)
  }

  lua_pushnil(L)
  while (lua_next(L, pos) !== 0) {
    let val = flua_readany(L, -1)
    lua_pop(L, 1)

    // array
    if (isArray) {
      let index = lua_tointeger(L, -1)
      if (index !== 0 && index <= size) {
        slice[index - 1] = val
      } else {
        isArray = false
      }
    }

    // object
    let key = '' + flua_readany(L, -1)
    object[key] = val
  }

  return isArray ? slice : object
}

// push stuff
function flua_pushobject(L, obj) {
  lua_createtable(L, 0, Object.keys(obj).length)
  for (let k in obj) {
    let v = obj[k]
    flua_pushany(L, k)
    flua_pushany(L, v)
    lua_rawset(L, -3)
  }
}

function flua_pusharray(L, s) {
  lua_createtable(L, s.length, 0)
  for (let i = 0; i < s.length; i++) {
    let v = s[i]
    flua_pushany(L, v)
    lua_rawseti(L, -2, i + 1)
  }
}

function flua_pushany(L, val) {
  switch (typeof val) {
    case 'string':
      lua_pushstring(L, val)
      break
    case 'number':
      lua_pushnumber(L, val)
      break
    case 'boolean':
      lua_pushboolean(L, val)
      break
    case 'object':
      if (Array.isArray(val)) {
        flua_pusharray(L, val)
      } else if (val === null) {
        lua_pushnil(L)
      } else {
        flua_pushobject(L, val)
      }
      break
    case 'function':
      lua_pushjsfunction(L, function(L) {
        let n = lua_gettop(L)
        var args = new Array(n)
        for (let i = 1; i <= n; i++) {
          args[i - 1] = flua_readany(L, i)
        }

        var returned = val.apply(null, args)
        returned =
          returned === null
            ? []
            : Array.isArray(returned)
              ? returned
              : [returned]

        for (let i = 0; i < returned.length; i++) {
          flua_pushany(L, returned[i])
        }

        return returned.length
      })
      break
    default:
      lua_pushnil(L)
      break
  }
}
