function includeHTML() {
    $('#task-container').load("/html/task.html");
}

async function validateHTML() {
    var solution = await makeRequest("GET", "html/solution.html");
    solution = formatFactory(solution);


    var task = $("#task-container")[0].innerHTML;
    task = formatFactory(task);

    if (task == solution) {
        $("#feedback-correct").css("display", "block");
        $('#task-container').load("/html/letter.html");     
    } else {
        $("#feedback-wrong").css("display", "block");
    }
}

function makeRequest(method, url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}

function formatFactory(html) {
    function parse(html, tab = 0) {
        var tab;
        var html = $.parseHTML(html);
        var formatHtml = new String();

        function setTabs() {
            var tabs = new String();

            for (i = 0; i < tab; i++) {
                tabs += '\t';
            }
            return tabs;
        };


        $.each(html, function (i, el) {
            if (el.nodeName == '#text') {
                if (($(el).text().trim()).length) {
                    formatHtml += setTabs() + $(el).text().trim() + '\n';
                }
            } else {
                var innerHTML = $(el).html().trim();
                $(el).html(innerHTML.replace('\n', '').replace(/ +(?= )/g, ''));


                if ($(el).children().length) {
                    $(el).html('\n' + parse(innerHTML, (tab + 1)) + setTabs());
                    var outerHTML = $(el).prop('outerHTML').trim();
                    formatHtml += setTabs() + outerHTML + '\n';

                } else {
                    $(el).html(""); // outcomment this if we want to compare inner html
                    var outerHTML = $(el).prop('outerHTML').trim();
                    formatHtml += setTabs() + outerHTML + '\n';
                }
            }
        });

        return formatHtml;
    };

    return parse(html.replace(/(\r\n|\n|\r)/gm, " ").replace(/ +(?= )/g, ''));
}; 
