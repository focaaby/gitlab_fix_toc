var vm = {　　　　
    /* Detection if we are on GitLab page */
    isGitLab: function () {
        var isGitLab = document.querySelector("meta[content^='GitLab']");
        if (!isGitLab) {
            return false;
        } else {
            return true;
        }
    },
    isFilePage: function () {
        return $(".shortcuts-find-file").size() > 0 || ($(".file-holder").size() > 0 && $(".sub-nav li.active a").text().trim() === 'Files');
    },
    isIssuePage: function () {
        return $(".issue-details").size() > 0;
    },
};


function checkFileReady() {
    var fileContent = null,
        level = 1,
        prev_level = 1,
        toc = "",
        href = "";

    if (!vm.isGitLab() || !(vm.isFilePage() || vm.isIssuePage())) {
        return;
    }

    fileContent = document.getElementsByClassName('file-content wiki')[0] || 
                  document.getElementsByClassName('wiki issue-realtime-trigger-pulse')[0];

    if (typeof(fileContent) == "undefined") {
        window.setTimeout(checkFileReady, 100);
    } else {
        toc = "<div class='gitlab_toc ui-widget-content'>";
        toc += "<ul class='gitlab_toc_ul'>";
        prev_level = 1;
        for(i = 0; i < fileContent.childNodes.length; i++) {
            if(["H1", "H2", "H3", "H4", "H5"].includes(fileContent.childNodes[i].nodeName)) {
                level = fileContent.childNodes[i].nodeName[1];
                if (level > prev_level) {
                    toc += "<ul class='gitlab_toc_ul'>";
                } else if (level < prev_level) {
                    toc += "</ul>";
                }
                
                href = fileContent.childNodes[i].childNodes[1].getAttribute("href");
                toc += "<li><a href=\"" + href + "\">" + fileContent.childNodes[i].innerText + "</a></li>";
                prev_level = level;
            }
        }
        toc += "</ul></div>";
        console.log(toc);
        $("body").append($(toc));
        var resize = '<div id="resizable" class="ui-widget-content"><h3 class="ui-widget-header">Resizable</h3></div>';
        $("body").append($(resize));
        $("#resizable").resizable();

        $(".gitlab_toc").resizable();
        $(".gitlab_toc").draggable();
    }
}

$(function () {
    checkFileReady();
});
