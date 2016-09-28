(function() {
    function _(x) {
        return document.getElementById(x);
    }
    function _h(x) {
        return _(x).innerHTML;
    }
    function t(tpl) {
        this.t = tpl;
    }
    function scrub(val) {
        return new Option(val).innerHTML.replace(/"/g,"&quot;");
    }
    function get_value(vars, key) {
        var parts = key.split('.');
        while (parts.length) {
            if (!(parts[0] in vars)) {
                return false;
            }
            vars = vars[parts.shift()];
        }
        return vars;
    }
    function render(fragment, vars) {
        var blockregex = /\{\{(([@!]?)(.+?))\}\}(([\s\S]+?)(\{\{:\1\}\}([\s\S]+?))?)\{\{\/\1\}\}/g,
            valregex = /\{\{([=%])(.+?)\}\}/g;
        return fragment.replace(blockregex, function(_, __, meta, key, inner, if_true, has_else, if_false) {
            var val = get_value(vars,key), temp = "", i;
            if (!val) {
                if (meta == '!') {
                    return render(inner, vars);
                }
                if (has_else) {
                    return render(if_false, vars);
                }
                return "";
            }
            if (!meta) {
                return render(if_true, vars);
            }
            if (meta == '@') {
                _ = vars._key;
                __ = vars._val;
                for (i in val) {
                    if (val.hasOwnProperty(i)) {
                        vars._key = i;
                        vars._val = val[i];
                        temp += render(inner, vars);
                    }
                }
                vars._key = _;
                vars._val = __;
                return temp;
            }
        }).replace(valregex, function(_, meta, key) {
            var val = get_value(vars,key);
            if (val || val === 0) {
                return meta == '%' ? scrub(val) : val;
            }
            return "";
        });
    }
    t.prototype.render = function (vars) {
        return render(this.t, vars);
    };
    var tpl = new t(_h('m_page'));
    var args = {
        mUrl: 'http://x.daima.co/',
        mName: '麦田一根葱',
        nav: {
            "/#!index": "首页",
            "/#!code": "代码",
            "/#!life": "生活",
            "/#!lab": "实验",
            "/#!msg": "留言"
        }
    };
    var now_nav = location.hash ? location.hash.match(/#!([^/]+)/g)[0] : '/#!index';
    var now_title = args.nav[now_nav];
    document.title = now_title + ' - ' + args.mName;
    _('m-page').innerHTML = tpl.render(args);
    _('m-page').onmousemove = function(e) {
        var w = this.scrollWidth,
            h = this.scrollHeight,
            sw = 25 / w,
            sh = 25 / h,
            pageX = e.pageX || e.clientX,
            pageY = e.pageY || e.clientY,
            pageX = (pageX - this.offsetLeft) - (w / 2),
            pageY = (pageY - this.offsetTop) - (h / 2),
            newX = ((sw * pageX)) * - 1,
            newY = ((sh * pageY)) * - 1;
        _('m-bg').style.webkitTransform = 'matrix(1,0,0,1,' + newX + ',' + newY + ')';
        _('m-bg').style.transform = 'matrix(1,0,0,1,' + newX + ',' + newY + ')';
        _('m-name').style.webkitTransform = ( -30 + newX) + 'px ' + ( -30 + newY) + 'px 1px rgba(0, 0, 0, 0.2)';
        _('m-name').style.textShadow = ( -30 + newX) + 'px ' + (-30 + newY) + 'px 1px rgba(0, 0, 0, 0.2)';

    };
})();
