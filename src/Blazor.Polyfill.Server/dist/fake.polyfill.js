window._import_ = function (fileName, webRootPath) {

    if (webRootPath === undefined || webRootPath === null) {
        webRootPath = "";
    }

    function pathJoin(path1, path2) {

        if (path1 === null || path1 === undefined) {
            path1 = "";
        }

        if (path2 === null || path2 === undefined) {
            path2 = "";
        }

        var needTrail = true;
        var path1hasTrail = false;
        var path2hasTrail = false;

        if (path1.length - 1 >= 0 && (path1[path1.length - 1] == '/' || path1[path1.length - 1] == '\\')) {
            needTrail = false;
            path1hasTrail = true;
        }

        if (path2.length > 0 && (path2[0] == '/' || path2[0] == '\\')) {
            needTrail = false;
            path2hasTrail = true;
        }

        if (needTrail) {
            return path1 + "/" + path2;
        }
        else {
            if (path1hasTrail && path2hasTrail) {
                return path1 + path2.substring(1);
            }
            else if (path1hasTrail && !path2hasTrail) {
                return path1 + path2;
            }
            else if (!path1hasTrail && path2hasTrail) {
                return path1 + path2;
            }
        }
    }

    fileName = pathJoin(webRootPath, fileName);

    if (fileName.length > 0 && fileName[0] !== '/') {
        console.log("_import_: For compatibility reasons, assuming current path '" + fileName + "' as absolute.");
    }

    function absolutePathParser(base, relative) {
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); // remove current file name (or empty string)
        // (omit if "base" is the current folder without trailing slash)
        for (var i = 0; i < parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }

    //Replace all ambigeous "\" to "/"
    fileName = fileName.replace(/\\/gi, "/");

    //Parse any strange URI path
    fileName = absolutePathParser("", fileName);

    //Add a "/" to the start if not present
    if (fileName[0] !== '/') {
        fileName = "/" + fileName;
    }

	return import(fileName);
};