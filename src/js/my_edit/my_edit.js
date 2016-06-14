require('./my_edit.styl');
require('../base.js');

class Edit {
  constructor () {
    this.$container = $('.my-edit-main');
    this.bindEvent();
  }

  bindEvent () {
    var self = this;

    self.$container.delegate('.action-save', 'click', (e) => {
      var data;

      if (data = self.vaild()) {
        // 修改请求
      }
    });
  }

  /**
   * 验证信息
   */
  vaild () {
    var self = this;
    var arr = self.$container.find('form').serializeArray();
    var vaild = true;

    arr.forEach(function (item) {
      if (!vaild) {
        return;
      }

      // 判断价格
      if (item.name == 'count') {
        if (!/^\d+$/.test(item.value) || (item.value < 1 && item.value > 100)) {
          new jsmod.ui.Toast(self.getErrorMsg(item.name));
        }
      } else {
      // 判断其余的内容
        if (!item.value) {
          vaild = false;

          new jsmod.ui.Toast(self.getErrorMsg(item.name));

          return false;
        }
      }

      /// 验证通过可以返回需要ajax提交的数据
      if (vaild) {
        var out = {};

        arr.forEach(function (item) {
          out[item.name] = item.value;
        });

        return out;
      }
    });
  }

  /**
   * 获取错误信息
   */
  getErrorMsg (key) {
    var msg;

    this.$container.find('textarea, input').each((idx, el) => {
      if (key == $(el).prop('name')) {
        msg = $(el).data('msg');
      }
    });

    return msg;
  }
}

new Edit();