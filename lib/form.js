module.exports = {
  get: form => {
    var data = {};
    $(`${form} :input`).each(function() {
      if (!this.name) return;
      let value = this.value;
      if (this.type == "checkbox") {
        value = this.checked;
      }
      if (this.type == "radio") {
        value = $(`input[name="${this.name}"]:checked`).val();
      }
      if (this.type == "select") {
        value = $(`select[name="${this.name}"]`).val();
      }
      let group = $(this).data("group");
      if (group) {
        data[group] = {
          ...data[group],
          ...{
            [this.name]: value
          }
        };
      } else {
        data[this.name] = value;
      }
    });
    return data;
  },

  set: (form, data, fields) => {
    if (!fields) {
      fields = [];
      for (let key in data) {
        fields.push(key);
      }
    } else {
      fields = fields.split(",");
    }

    let nested = [];

    fields.forEach(f => {
      let datatype = typeof data[f];
      if (datatype === "string" || datatype === "number" || datatype === "boolean") {
        $(`${form} input[name=${f}]:not([group])`).val(data[f]);
        $(`${form} select[name=${f}]:not([group])`).val(data[f]);
        $(`${form} textarea[name=${f}]:not([group])`).val(data[f]);
      } else if (datatype === "object") {
        if (!Array.isArray(data[f])) nested.push(f);
      }
    });
    nested.forEach(nestedf => {
      let nestedData = data[nestedf];
      let innerFields = [];
      for (let key in nestedData) {
        innerFields.push(key);
      }
      innerFields.forEach(inf => {
        let innerData = nestedData[inf];
        let innerDatatype = typeof innerData;
        if (
          innerDatatype === "string" ||
          innerDatatype === "number" ||
          innerDatatype === "boolean"
        ) {
          $(`${form} input[name=${inf}][data-group=${nestedf}]`).val(innerData);
          $(`${form} select[name=${inf}][data-group=${nestedf}]`).val(innerData);
          $(`${form} textarea[name=${inf}][data-group=${nestedf}]`).val(innerData);
        }
      });
    });
  },

  clear: form => {
    $(":input", form)
      .not(":button, :submit, :reset")
      .val("")
      .prop("checked", false)
      .prop("selected", false);
  }
};
