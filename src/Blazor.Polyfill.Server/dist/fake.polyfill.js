window._import_ = function (fileName) {
	if (fileName.length > 0 && fileName[0] === '.') {
		throw new Error("_import_: For compatibility reason please use absolute path");
	}
	return import(fileName);
};