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
    }
};


function checkFileReady() {
    var fileContent = null,
        level = 1,
        prev_level = 1,
        i = 0,
        j = 0,
        toc = "",
        href = "";

    if (!vm.isGitLab() || !(vm.isFilePage() || vm.isIssuePage())) {
        return;
    }

    fileContent = document.getElementsByClassName('wiki')[0];

    if (typeof(fileContent) == "undefined") {
        window.setTimeout(checkFileReady, 100);
    } else {
        var toc = document.createElement('div');
        toc.className = 'gitlab_toc ui-widget-content';
        var toc_ul = document.createElement('ul');
        toc_ul.className = 'nav gitlab_toc_ul';
        toc.appendChild(toc_ul);
        var $toc_ul = $(toc_ul);

        prev_level = 1;
        for(i = 0; i < fileContent.childNodes.length; i++) {
            if(["H1", "H2", "H3", "H4", "H5"].includes(fileContent.childNodes[i].nodeName)) {
                level = fileContent.childNodes[i].nodeName[1];
                if (level > prev_level) {
                    $toc_ul = $toc_ul.children().last('li');
                    $toc_ul.append(`<ul class='nav'>`)
                    $toc_ul = $toc_ul.children().last('ul');
                } else if (level < prev_level) {
                    $toc_ul = $toc_ul.parent().parent();
                }
                
                href = fileContent.childNodes[i].childNodes[1].getAttribute("href");
                $toc_ul.append(`<li id="toc-${i}"><a href="${href}">${fileContent.childNodes[i].innerText}</a></li>`);
                prev_level = level;
            }
        }
        $("body").append($(toc));
        $(".gitlab_toc").resizable({handles: "all"});
        $(".gitlab_toc").draggable();
    }
}

$(function () {
    checkFileReady();
});
