;(function() {
  function _(x) {
    return document.getElementById(x)
  }
  function _h(x) {
    return _(x).innerHTML
  }
  function t(tpl) {
    this.t = tpl
  }
  function scrub(val) {
    return new Option(val).innerHTML.replace(/"/g, '&quot;')
  }
  function get_value(vars, key) {
    var parts = key.split('.')
    while (parts.length) {
      if (!(parts[0] in vars)) {
        return false
      }
      vars = vars[parts.shift()]
    }
    return vars
  }
  function render(fragment, vars) {
    var blockregex = /\{\{(([@!]?)(.+?))\}\}(([\s\S]+?)(\{\{:\1\}\}([\s\S]+?))?)\{\{\/\1\}\}/g,
      valregex = /\{\{([=%])(.+?)\}\}/g
    return fragment
      .replace(blockregex, function(_, __, meta, key, inner, if_true, has_else, if_false) {
        var val = get_value(vars, key),
          temp = '',
          i
        if (!val) {
          if (meta == '!') {
            return render(inner, vars)
          }
          if (has_else) {
            return render(if_false, vars)
          }
          return ''
        }
        if (!meta) {
          return render(if_true, vars)
        }
        if (meta == '@') {
          _ = vars._key
          __ = vars._val
          for (i in val) {
            if (val.hasOwnProperty(i)) {
              vars._key = i
              vars._val = val[i]
              temp += render(inner, vars)
            }
          }
          vars._key = _
          vars._val = __
          return temp
        }
      })
      .replace(valregex, function(_, meta, key) {
        var val = get_value(vars, key)
        if (val || val === 0) {
          return meta == '%' ? scrub(val) : val
        }
        return ''
      })
  }
  function move() {
    x += (followX - x) * friction;
    y += (followY - y) * friction;
    _('m-bg').style.transitionDuration = '0s'
    _('m-bg').style.transform = 'matrix(1,0,0,1,' + x + ',' + y + ') scale(1.1)'
    _('m-name').style.textShadow = -30 + x + 'px ' + (-30 + y) + 'px 1px rgba(255, 255, 255, 0.2)'
    window.requestAnimationFrame(move);
  }
  t.prototype.render = function(vars) {
    return render(this.t, vars)
  }
  var x = 0, y = 0, followX = 0, followY = 0, friction = 1 / 10;
  var tpl = new t(_h('m_page'))
  var args = {
    mUrl: 'https://maicong.github.io/yourname',
    mName: '你的名字是？'
  }
  var title = args.mName
  document.title = title
  _('m-page').innerHTML = tpl.render(args)
  _('m-page').addEventListener('mousemove', function(e){
    var mouseX = Math.max(-100, Math.min(100, window.innerWidth / 2 - e.clientX));
    var mouseY = Math.max(-100, Math.min(100, window.innerHeight / 2 - e.clientY));
    followX = (30 * mouseX) / 100;
    followY = (20 * mouseY) / 100;
  })
  move()
})()
