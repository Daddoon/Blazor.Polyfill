window._import_ = function (fileName) {

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