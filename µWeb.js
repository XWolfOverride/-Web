/*  µWeb 1.0 Web development micro-framework
 *  Copyright 2022 XWolfOverride
 *
 *  Licensed under the MIT License
 * 
 *  Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 *  and associated documentation files (the "Software"), to deal in the Software without restriction,
 *  including without limitation the rights to use, copy, modify, merge, publish, distribute,
 *  sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 * 
 *  The above copyright notice and this permission notice shall be included in all copies or
 *  substantial portions of the Software.
 * 
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 *  BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 *  DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var µWeb = (function () {

    /**
     * Show dialog
     * The dialog is a div element on the page with default styling for hidden and position
     * Id's on the dialog should start with the same id base in order to use the get funciton
     * @param {string} did Dialog base id
     * @param {function} fninit init function
     * @param {*} buttons button definition and logic.
     * @returns Dialog API
     */
    function dialog(did, fninit, buttons) {
        var api = {
            get: id => {
                if (!id)
                    return dialog;
                var dom = document.getElementById(did + "-" + id);
                if (!dom)
                    console.error("Dialog '" + did + "': element '" + did + "-" + k + "' not found.");
                return dom;
            },
            close: () => showDialog(false),
        }, dialog = document.getElementById(did);
        function showDialog(show) {
            var cssfnc = show ? "add" : "remove";
            document.getElementById("wall").classList[cssfnc]("show");
            dialog.classList[cssfnc]("show");
        }

        fninit && fninit(api);
        function installButtonEvent(dom, event) {
            dom.onclick = () => event(api);
        }
        for (var k in buttons)
            installButtonEvent(api.get(k), buttons[k]);
        showDialog(true);
        return api;
    }

    /**
     * Generates a repetition of elements from a source of data
     * @param {dom} template Template dom
     * @param {function} fncreated Element created callback
     * @param {scting} idBase base id of repetition for each iteration (only for elements with id)
     * @returns Repeater instance API
     */
    function repeater(template, fncreated, idBase) {
        var target, rows;

        if (!idBase)
            idBase = "repeater";

        function feed(data) {
            clear();
            rows = [];
            for (var i in data) {
                var d = data[i];
                var r = template.cloneNode(true);
                populate(r, d, idBase + ":" + i + "::", r);
                r._repeater_data = d;
                r._repeater_index = i;
                rows.push(r);
                fncreated && fncreated(r, d);
                target.appendChild(r);
            }
        }
        function clear() {
            if (!rows)
                return;
            rows.forEach(r => {
                r.parentElement.removeChild(r);
            });
        }

        // == Configuration
        function setTemplate(templ) {
            template = templ
            if (templ.parentElement) {
                target = templ.parentElement;
                templ.parentElement.removeChild(templ);
            }
        }
        function setTarget(trg) {
            target = trg;
        }
        setTemplate(template);
        return {
            feed: feed,
            clear: clear,
            setTemplate: setTemplate,
            setTarget: setTarget,
        }
    }

    function populate(dom, data, idBase, link) {
        if (dom.id && idBase)
            dom.id = idBase + dom.id;
        dom._link = link;
        // process dataset:
        for (var k in dom.dataset) {
            var d = data[dom.dataset[k]];
            if (d === undefined) d = "";
            if (k == '#')
                dom.innerText = d;
            else
                dom[k] = d;
        }
        // go to childs
        for (var i in dom.children)
            populate(dom.children[i], data, idBase, link);
    }

    return {
        dialog: dialog,
        repeater: repeater,
        populate: populate
    }
})();


