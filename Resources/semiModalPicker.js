var stringToDate = function(dateString) {
    dateString = dateString || "";
    var matches = /(\d+)\/(\d+)\/(\d+)/.exec(dateString);
    if (matches && matches.length >= 4) return new Date(matches[3], matches[1] - 1, matches[2]);
    return new Date();
};

var dateToString = function(date) {
    return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
};

exports.semiModalPicker = function(o) {
    var type = void 0 === o.type ? Ti.UI.PICKER_TYPE_PLAIN : o.type;
    var modalWin = Ti.UI.createWindow({
        backgroundColor: "transparent"
    });
    var overlay = Ti.UI.createView({
        backgroundColor: "#000",
        opacity: .6
    });
    var container = Ti.UI.createView({
        bottom: 0,
        layout: "vertical",
        height: "auto"
    });
    var picker = Ti.UI.createPicker({
        type: type,
        height: "auto",
        selectionIndicator: true
    });
    if (type === Ti.UI.PICKER_TYPE_DATE) picker.value = stringToDate(o.value); else if (o.data) for (var i in o.data) picker.add(Ti.UI.createPickerRow({
        title: o.data[i]
    }));
    picker.addEventListener("change", function() {});
    var cancel = Titanium.UI.createButton({
        title: "Cancel",
        height: 30,
        width: 80,
        style: Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
        left: 10
    });
    cancel.addEventListener("click", function() {
        modalWin.close();
    });
    var done = Titanium.UI.createButton({
        title: "Done",
        height: 30,
        width: 80,
        style: Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
        right: 10
    });
    done.addEventListener("click", function() {
        o.textField.value = type === Ti.UI.PICKER_TYPE_DATE ? dateToString(picker.value) : picker.getSelectedRow(0).title;
        modalWin.close();
    });
    Titanium.UI.createButton({
        systemButton: Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
    });
    var toolbar = Ti.UI.createView({
        height: 43,
        backgroundColor: "#bbb"
    });
    toolbar.add(cancel);
    toolbar.add(done);
    container.add(toolbar);
    container.add(picker);
    modalWin.add(overlay);
    modalWin.add(container);
    return modalWin;
};