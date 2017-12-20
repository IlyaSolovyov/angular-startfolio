/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "df47cc9443b8948eb15e"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return Promise.resolve(outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(115)(__webpack_require__.s = 115);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(3);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = vendor_4adf5b975b06d7f766a2;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(38);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(39);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PageService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__page__ = __webpack_require__(9);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var PageService = (function () {
    function PageService(http) {
        this.http = http;
    }
    PageService.prototype.getPages = function () {
        return this.http.get('api/Page/')
            .map(function (response) {
            return response.json()
                .results
                .map(function (page) {
                return new __WEBPACK_IMPORTED_MODULE_3__page__["a" /* Page */](page.id, page.position, page.pageTemplate, page.details);
            });
        });
    };
    PageService.prototype.getPage = function (position) {
        return this.http.get('api/Page/' + position)
            .map(function (response) { return response.json(); });
    };
    PageService.prototype.addPage = function (page) {
        return this.http.post('api/Page', page);
    };
    PageService.prototype.updateDetails = function (position, formData) {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["Headers"]();
        headers.set('Accept', 'application/json');
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["RequestOptions"]({ headers: headers });
        return this.http.put('api/Page/' + position + "/Details", formData, options);
    };
    PageService.prototype.updatePosition = function (position) {
        return this.http.delete('api/Page/' + position + "/Details");
    };
    PageService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["Http"]])
    ], PageService);
    return PageService;
}());



/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(6);

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BrowserAnimationsModule; });
/* unused harmony export NoopAnimationsModule */
/* unused harmony export ɵBrowserAnimationBuilder */
/* unused harmony export ɵBrowserAnimationFactory */
/* unused harmony export ɵAnimationRenderer */
/* unused harmony export ɵAnimationRendererFactory */
/* unused harmony export ɵa */
/* unused harmony export ɵf */
/* unused harmony export ɵg */
/* unused harmony export ɵb */
/* unused harmony export ɵd */
/* unused harmony export ɵe */
/* unused harmony export ɵc */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_animations__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_animations_browser__ = __webpack_require__(17);

/**
 * @license Angular v4.4.6
 * (c) 2010-2017 Google, Inc. https://angular.io/
 * License: MIT
 */




/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var BrowserAnimationBuilder = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["__extends"](BrowserAnimationBuilder, _super);
    /**
     * @param {?} rootRenderer
     * @param {?} doc
     */
    function BrowserAnimationBuilder(rootRenderer, doc) {
        var _this = _super.call(this) || this;
        _this._nextAnimationId = 0;
        var typeData = {
            id: '0',
            encapsulation: __WEBPACK_IMPORTED_MODULE_1__angular_core__["ViewEncapsulation"].None,
            styles: [],
            data: { animation: [] }
        };
        _this._renderer = rootRenderer.createRenderer(doc.body, typeData);
        return _this;
    }
    /**
     * @param {?} animation
     * @return {?}
     */
    BrowserAnimationBuilder.prototype.build = function (animation) {
        var /** @type {?} */ id = this._nextAnimationId.toString();
        this._nextAnimationId++;
        var /** @type {?} */ entry = Array.isArray(animation) ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__angular_animations__["sequence"])(animation) : animation;
        issueAnimationCommand(this._renderer, null, id, 'register', [entry]);
        return new BrowserAnimationFactory(id, this._renderer);
    };
    return BrowserAnimationBuilder;
}(__WEBPACK_IMPORTED_MODULE_3__angular_animations__["AnimationBuilder"]));
BrowserAnimationBuilder.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["Injectable"] },
];
/**
 * @nocollapse
 */
BrowserAnimationBuilder.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["RendererFactory2"], },
    { type: undefined, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["DOCUMENT"],] },] },
]; };
var BrowserAnimationFactory = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["__extends"](BrowserAnimationFactory, _super);
    /**
     * @param {?} _id
     * @param {?} _renderer
     */
    function BrowserAnimationFactory(_id, _renderer) {
        var _this = _super.call(this) || this;
        _this._id = _id;
        _this._renderer = _renderer;
        return _this;
    }
    /**
     * @param {?} element
     * @param {?=} options
     * @return {?}
     */
    BrowserAnimationFactory.prototype.create = function (element, options) {
        return new RendererAnimationPlayer(this._id, element, options || {}, this._renderer);
    };
    return BrowserAnimationFactory;
}(__WEBPACK_IMPORTED_MODULE_3__angular_animations__["AnimationFactory"]));
var RendererAnimationPlayer = (function () {
    /**
     * @param {?} id
     * @param {?} element
     * @param {?} options
     * @param {?} _renderer
     */
    function RendererAnimationPlayer(id, element, options, _renderer) {
        this.id = id;
        this.element = element;
        this._renderer = _renderer;
        this.parentPlayer = null;
        this._started = false;
        this.totalTime = 0;
        this._command('create', options);
    }
    /**
     * @param {?} eventName
     * @param {?} callback
     * @return {?}
     */
    RendererAnimationPlayer.prototype._listen = function (eventName, callback) {
        return this._renderer.listen(this.element, "@@" + this.id + ":" + eventName, callback);
    };
    /**
     * @param {?} command
     * @param {...?} args
     * @return {?}
     */
    RendererAnimationPlayer.prototype._command = function (command) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return issueAnimationCommand(this._renderer, this.element, this.id, command, args);
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    RendererAnimationPlayer.prototype.onDone = function (fn) { this._listen('done', fn); };
    /**
     * @param {?} fn
     * @return {?}
     */
    RendererAnimationPlayer.prototype.onStart = function (fn) { this._listen('start', fn); };
    /**
     * @param {?} fn
     * @return {?}
     */
    RendererAnimationPlayer.prototype.onDestroy = function (fn) { this._listen('destroy', fn); };
    /**
     * @return {?}
     */
    RendererAnimationPlayer.prototype.init = function () { this._command('init'); };
    /**
     * @return {?}
     */
    RendererAnimationPlayer.prototype.hasStarted = function () { return this._started; };
    /**
     * @return {?}
     */
    RendererAnimationPlayer.prototype.play = function () {
        this._command('play');
        this._started = true;
    };
    /**
     * @return {?}
     */
    RendererAnimationPlayer.prototype.pause = function () { this._command('pause'); };
    /**
     * @return {?}
     */
    RendererAnimationPlayer.prototype.restart = function () { this._command('restart'); };
    /**
     * @return {?}
     */
    RendererAnimationPlayer.prototype.finish = function () { this._command('finish'); };
    /**
     * @return {?}
     */
    RendererAnimationPlayer.prototype.destroy = function () { this._command('destroy'); };
    /**
     * @return {?}
     */
    RendererAnimationPlayer.prototype.reset = function () { this._command('reset'); };
    /**
     * @param {?} p
     * @return {?}
     */
    RendererAnimationPlayer.prototype.setPosition = function (p) { this._command('setPosition', p); };
    /**
     * @return {?}
     */
    RendererAnimationPlayer.prototype.getPosition = function () { return 0; };
    return RendererAnimationPlayer;
}());
/**
 * @param {?} renderer
 * @param {?} element
 * @param {?} id
 * @param {?} command
 * @param {?} args
 * @return {?}
 */
function issueAnimationCommand(renderer, element, id, command, args) {
    return renderer.setProperty(element, "@@" + id + ":" + command, args);
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var ANIMATION_PREFIX = '@';
var DISABLE_ANIMATIONS_FLAG = '@.disabled';
var AnimationRendererFactory = (function () {
    /**
     * @param {?} delegate
     * @param {?} engine
     * @param {?} _zone
     */
    function AnimationRendererFactory(delegate, engine, _zone) {
        this.delegate = delegate;
        this.engine = engine;
        this._zone = _zone;
        this._currentId = 0;
        this._microtaskId = 1;
        this._animationCallbacksBuffer = [];
        this._rendererCache = new Map();
        this._cdRecurDepth = 0;
        engine.onRemovalComplete = function (element, delegate) {
            // Note: if an component element has a leave animation, and the component
            // a host leave animation, the view engine will call `removeChild` for the parent
            // component renderer as well as for the child component renderer.
            // Therefore, we need to check if we already removed the element.
            if (delegate && delegate.parentNode(element)) {
                delegate.removeChild(element.parentNode, element);
            }
        };
    }
    /**
     * @param {?} hostElement
     * @param {?} type
     * @return {?}
     */
    AnimationRendererFactory.prototype.createRenderer = function (hostElement, type) {
        var _this = this;
        var /** @type {?} */ EMPTY_NAMESPACE_ID = '';
        // cache the delegates to find out which cached delegate can
        // be used by which cached renderer
        var /** @type {?} */ delegate = this.delegate.createRenderer(hostElement, type);
        if (!hostElement || !type || !type.data || !type.data['animation']) {
            var /** @type {?} */ renderer = this._rendererCache.get(delegate);
            if (!renderer) {
                renderer = new BaseAnimationRenderer(EMPTY_NAMESPACE_ID, delegate, this.engine);
                // only cache this result when the base renderer is used
                this._rendererCache.set(delegate, renderer);
            }
            return renderer;
        }
        var /** @type {?} */ componentId = type.id;
        var /** @type {?} */ namespaceId = type.id + '-' + this._currentId;
        this._currentId++;
        this.engine.register(namespaceId, hostElement);
        var /** @type {?} */ animationTriggers = (type.data['animation']);
        animationTriggers.forEach(function (trigger) { return _this.engine.registerTrigger(componentId, namespaceId, hostElement, trigger.name, trigger); });
        return new AnimationRenderer(this, namespaceId, delegate, this.engine);
    };
    /**
     * @return {?}
     */
    AnimationRendererFactory.prototype.begin = function () {
        this._cdRecurDepth++;
        if (this.delegate.begin) {
            this.delegate.begin();
        }
    };
    /**
     * @return {?}
     */
    AnimationRendererFactory.prototype._scheduleCountTask = function () {
        var _this = this;
        Zone.current.scheduleMicroTask('incremenet the animation microtask', function () { return _this._microtaskId++; });
    };
    /**
     * @param {?} count
     * @param {?} fn
     * @param {?} data
     * @return {?}
     */
    AnimationRendererFactory.prototype.scheduleListenerCallback = function (count, fn, data) {
        var _this = this;
        if (count >= 0 && count < this._microtaskId) {
            this._zone.run(function () { return fn(data); });
            return;
        }
        if (this._animationCallbacksBuffer.length == 0) {
            Promise.resolve(null).then(function () {
                _this._zone.run(function () {
                    _this._animationCallbacksBuffer.forEach(function (tuple) {
                        var fn = tuple[0], data = tuple[1];
                        fn(data);
                    });
                    _this._animationCallbacksBuffer = [];
                });
            });
        }
        this._animationCallbacksBuffer.push([fn, data]);
    };
    /**
     * @return {?}
     */
    AnimationRendererFactory.prototype.end = function () {
        var _this = this;
        this._cdRecurDepth--;
        // this is to prevent animations from running twice when an inner
        // component does CD when a parent component insted has inserted it
        if (this._cdRecurDepth == 0) {
            this._zone.runOutsideAngular(function () {
                _this._scheduleCountTask();
                _this.engine.flush(_this._microtaskId);
            });
        }
        if (this.delegate.end) {
            this.delegate.end();
        }
    };
    /**
     * @return {?}
     */
    AnimationRendererFactory.prototype.whenRenderingDone = function () { return this.engine.whenRenderingDone(); };
    return AnimationRendererFactory;
}());
AnimationRendererFactory.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["Injectable"] },
];
/**
 * @nocollapse
 */
AnimationRendererFactory.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["RendererFactory2"], },
    { type: __WEBPACK_IMPORTED_MODULE_4__angular_animations_browser__["a" /* ɵAnimationEngine */], },
    { type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["NgZone"], },
]; };
var BaseAnimationRenderer = (function () {
    /**
     * @param {?} namespaceId
     * @param {?} delegate
     * @param {?} engine
     */
    function BaseAnimationRenderer(namespaceId, delegate, engine) {
        this.namespaceId = namespaceId;
        this.delegate = delegate;
        this.engine = engine;
        this.destroyNode = this.delegate.destroyNode ? function (n) { return delegate.destroyNode(n); } : null;
    }
    Object.defineProperty(BaseAnimationRenderer.prototype, "data", {
        /**
         * @return {?}
         */
        get: function () { return this.delegate.data; },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    BaseAnimationRenderer.prototype.destroy = function () {
        this.engine.destroy(this.namespaceId, this.delegate);
        this.delegate.destroy();
    };
    /**
     * @param {?} name
     * @param {?=} namespace
     * @return {?}
     */
    BaseAnimationRenderer.prototype.createElement = function (name, namespace) {
        return this.delegate.createElement(name, namespace);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    BaseAnimationRenderer.prototype.createComment = function (value) { return this.delegate.createComment(value); };
    /**
     * @param {?} value
     * @return {?}
     */
    BaseAnimationRenderer.prototype.createText = function (value) { return this.delegate.createText(value); };
    /**
     * @param {?} parent
     * @param {?} newChild
     * @return {?}
     */
    BaseAnimationRenderer.prototype.appendChild = function (parent, newChild) {
        this.delegate.appendChild(parent, newChild);
        this.engine.onInsert(this.namespaceId, newChild, parent, false);
    };
    /**
     * @param {?} parent
     * @param {?} newChild
     * @param {?} refChild
     * @return {?}
     */
    BaseAnimationRenderer.prototype.insertBefore = function (parent, newChild, refChild) {
        this.delegate.insertBefore(parent, newChild, refChild);
        this.engine.onInsert(this.namespaceId, newChild, parent, true);
    };
    /**
     * @param {?} parent
     * @param {?} oldChild
     * @return {?}
     */
    BaseAnimationRenderer.prototype.removeChild = function (parent, oldChild) {
        this.engine.onRemove(this.namespaceId, oldChild, this.delegate);
    };
    /**
     * @param {?} selectorOrNode
     * @return {?}
     */
    BaseAnimationRenderer.prototype.selectRootElement = function (selectorOrNode) { return this.delegate.selectRootElement(selectorOrNode); };
    /**
     * @param {?} node
     * @return {?}
     */
    BaseAnimationRenderer.prototype.parentNode = function (node) { return this.delegate.parentNode(node); };
    /**
     * @param {?} node
     * @return {?}
     */
    BaseAnimationRenderer.prototype.nextSibling = function (node) { return this.delegate.nextSibling(node); };
    /**
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @param {?=} namespace
     * @return {?}
     */
    BaseAnimationRenderer.prototype.setAttribute = function (el, name, value, namespace) {
        this.delegate.setAttribute(el, name, value, namespace);
    };
    /**
     * @param {?} el
     * @param {?} name
     * @param {?=} namespace
     * @return {?}
     */
    BaseAnimationRenderer.prototype.removeAttribute = function (el, name, namespace) {
        this.delegate.removeAttribute(el, name, namespace);
    };
    /**
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    BaseAnimationRenderer.prototype.addClass = function (el, name) { this.delegate.addClass(el, name); };
    /**
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    BaseAnimationRenderer.prototype.removeClass = function (el, name) { this.delegate.removeClass(el, name); };
    /**
     * @param {?} el
     * @param {?} style
     * @param {?} value
     * @param {?=} flags
     * @return {?}
     */
    BaseAnimationRenderer.prototype.setStyle = function (el, style, value, flags) {
        this.delegate.setStyle(el, style, value, flags);
    };
    /**
     * @param {?} el
     * @param {?} style
     * @param {?=} flags
     * @return {?}
     */
    BaseAnimationRenderer.prototype.removeStyle = function (el, style, flags) {
        this.delegate.removeStyle(el, style, flags);
    };
    /**
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    BaseAnimationRenderer.prototype.setProperty = function (el, name, value) {
        if (name.charAt(0) == ANIMATION_PREFIX && name == DISABLE_ANIMATIONS_FLAG) {
            this.disableAnimations(el, !!value);
        }
        else {
            this.delegate.setProperty(el, name, value);
        }
    };
    /**
     * @param {?} node
     * @param {?} value
     * @return {?}
     */
    BaseAnimationRenderer.prototype.setValue = function (node, value) { this.delegate.setValue(node, value); };
    /**
     * @param {?} target
     * @param {?} eventName
     * @param {?} callback
     * @return {?}
     */
    BaseAnimationRenderer.prototype.listen = function (target, eventName, callback) {
        return this.delegate.listen(target, eventName, callback);
    };
    /**
     * @param {?} element
     * @param {?} value
     * @return {?}
     */
    BaseAnimationRenderer.prototype.disableAnimations = function (element, value) {
        this.engine.disableAnimations(element, value);
    };
    return BaseAnimationRenderer;
}());
var AnimationRenderer = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["__extends"](AnimationRenderer, _super);
    /**
     * @param {?} factory
     * @param {?} namespaceId
     * @param {?} delegate
     * @param {?} engine
     */
    function AnimationRenderer(factory, namespaceId, delegate, engine) {
        var _this = _super.call(this, namespaceId, delegate, engine) || this;
        _this.factory = factory;
        _this.namespaceId = namespaceId;
        return _this;
    }
    /**
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    AnimationRenderer.prototype.setProperty = function (el, name, value) {
        if (name.charAt(0) == ANIMATION_PREFIX) {
            if (name.charAt(1) == '.' && name == DISABLE_ANIMATIONS_FLAG) {
                value = value === undefined ? true : !!value;
                this.disableAnimations(el, /** @type {?} */ (value));
            }
            else {
                this.engine.process(this.namespaceId, el, name.substr(1), value);
            }
        }
        else {
            this.delegate.setProperty(el, name, value);
        }
    };
    /**
     * @param {?} target
     * @param {?} eventName
     * @param {?} callback
     * @return {?}
     */
    AnimationRenderer.prototype.listen = function (target, eventName, callback) {
        var _this = this;
        if (eventName.charAt(0) == ANIMATION_PREFIX) {
            var /** @type {?} */ element = resolveElementFromTarget(target);
            var /** @type {?} */ name = eventName.substr(1);
            var /** @type {?} */ phase = '';
            // @listener.phase is for trigger animation callbacks
            // @@listener is for animation builder callbacks
            if (name.charAt(0) != ANIMATION_PREFIX) {
                _a = parseTriggerCallbackName(name), name = _a[0], phase = _a[1];
            }
            return this.engine.listen(this.namespaceId, element, name, phase, function (event) {
                var /** @type {?} */ countId = ((event))['_data'] || -1;
                _this.factory.scheduleListenerCallback(countId, callback, event);
            });
        }
        return this.delegate.listen(target, eventName, callback);
        var _a;
    };
    return AnimationRenderer;
}(BaseAnimationRenderer));
/**
 * @param {?} target
 * @return {?}
 */
function resolveElementFromTarget(target) {
    switch (target) {
        case 'body':
            return document.body;
        case 'document':
            return document;
        case 'window':
            return window;
        default:
            return target;
    }
}
/**
 * @param {?} triggerName
 * @return {?}
 */
function parseTriggerCallbackName(triggerName) {
    var /** @type {?} */ dotIndex = triggerName.indexOf('.');
    var /** @type {?} */ trigger = triggerName.substring(0, dotIndex);
    var /** @type {?} */ phase = triggerName.substr(dotIndex + 1);
    return [trigger, phase];
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var InjectableAnimationEngine = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["__extends"](InjectableAnimationEngine, _super);
    /**
     * @param {?} driver
     * @param {?} normalizer
     */
    function InjectableAnimationEngine(driver, normalizer) {
        return _super.call(this, driver, normalizer) || this;
    }
    return InjectableAnimationEngine;
}(__WEBPACK_IMPORTED_MODULE_4__angular_animations_browser__["a" /* ɵAnimationEngine */]));
InjectableAnimationEngine.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["Injectable"] },
];
/**
 * @nocollapse
 */
InjectableAnimationEngine.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_4__angular_animations_browser__["b" /* AnimationDriver */], },
    { type: __WEBPACK_IMPORTED_MODULE_4__angular_animations_browser__["c" /* ɵAnimationStyleNormalizer */], },
]; };
/**
 * @return {?}
 */
function instantiateSupportedAnimationDriver() {
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__angular_animations_browser__["d" /* ɵsupportsWebAnimations */])()) {
        return new __WEBPACK_IMPORTED_MODULE_4__angular_animations_browser__["e" /* ɵWebAnimationsDriver */]();
    }
    return new __WEBPACK_IMPORTED_MODULE_4__angular_animations_browser__["f" /* ɵNoopAnimationDriver */]();
}
/**
 * @return {?}
 */
function instantiateDefaultStyleNormalizer() {
    return new __WEBPACK_IMPORTED_MODULE_4__angular_animations_browser__["g" /* ɵWebAnimationsStyleNormalizer */]();
}
/**
 * @param {?} renderer
 * @param {?} engine
 * @param {?} zone
 * @return {?}
 */
function instantiateRendererFactory(renderer, engine, zone) {
    return new AnimationRendererFactory(renderer, engine, zone);
}
var SHARED_ANIMATION_PROVIDERS = [
    { provide: __WEBPACK_IMPORTED_MODULE_3__angular_animations__["AnimationBuilder"], useClass: BrowserAnimationBuilder },
    { provide: __WEBPACK_IMPORTED_MODULE_4__angular_animations_browser__["c" /* ɵAnimationStyleNormalizer */], useFactory: instantiateDefaultStyleNormalizer },
    { provide: __WEBPACK_IMPORTED_MODULE_4__angular_animations_browser__["a" /* ɵAnimationEngine */], useClass: InjectableAnimationEngine }, {
        provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["RendererFactory2"],
        useFactory: instantiateRendererFactory,
        deps: [__WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["ɵDomRendererFactory2"], __WEBPACK_IMPORTED_MODULE_4__angular_animations_browser__["a" /* ɵAnimationEngine */], __WEBPACK_IMPORTED_MODULE_1__angular_core__["NgZone"]]
    }
];
/**
 * Separate providers from the actual module so that we can do a local modification in Google3 to
 * include them in the BrowserModule.
 */
var BROWSER_ANIMATIONS_PROVIDERS = [
    { provide: __WEBPACK_IMPORTED_MODULE_4__angular_animations_browser__["b" /* AnimationDriver */], useFactory: instantiateSupportedAnimationDriver }
].concat(SHARED_ANIMATION_PROVIDERS);
/**
 * Separate providers from the actual module so that we can do a local modification in Google3 to
 * include them in the BrowserTestingModule.
 */
var BROWSER_NOOP_ANIMATIONS_PROVIDERS = [{ provide: __WEBPACK_IMPORTED_MODULE_4__angular_animations_browser__["b" /* AnimationDriver */], useClass: __WEBPACK_IMPORTED_MODULE_4__angular_animations_browser__["f" /* ɵNoopAnimationDriver */] }].concat(SHARED_ANIMATION_PROVIDERS);
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * \@experimental Animation support is experimental.
 */
var BrowserAnimationsModule = (function () {
    function BrowserAnimationsModule() {
    }
    return BrowserAnimationsModule;
}());
BrowserAnimationsModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"], args: [{
                exports: [__WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["BrowserModule"]],
                providers: BROWSER_ANIMATIONS_PROVIDERS,
            },] },
];
/**
 * @nocollapse
 */
BrowserAnimationsModule.ctorParameters = function () { return []; };
/**
 * \@experimental Animation support is experimental.
 */
var NoopAnimationsModule = (function () {
    function NoopAnimationsModule() {
    }
    return NoopAnimationsModule;
}());
NoopAnimationsModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"], args: [{
                exports: [__WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["BrowserModule"]],
                providers: BROWSER_NOOP_ANIMATIONS_PROVIDERS,
            },] },
];
/**
 * @nocollapse
 */
NoopAnimationsModule.ctorParameters = function () { return []; };
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @module
 * @description
 * Entry point for all animation APIs of the animation browser package.
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @module
 * @description
 * Entry point for all public APIs of the animation package.
 */
/**
 * Generated bundle index. Do not edit.
 */

//# sourceMappingURL=animations.es5.js.map


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_page_service__ = __webpack_require__(5);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AppComponent = (function () {
    function AppComponent(pageService) {
        this.pageService = pageService;
    }
    AppComponent.prototype.ngOnInit = function () {
        this.pages = this.pageService.getPages();
    };
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app',
            template: __webpack_require__(61),
            styles: [__webpack_require__(89)]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__services_page_service__["a" /* PageService */]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var Page = (function () {
    function Page(id, position, pageTemplate, details) {
        this.id = id;
        this.position = position;
        this.pageTemplate = pageTemplate;
        this.details = details;
    }
    Page = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [Number, Number, String, String])
    ], Page);
    return Page;
}());



/***/ }),
/* 10 */
/***/ (function(module, exports) {

var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];

var alphaIndex = {};
var charIndex = {};

createIndexes(alphaIndex, charIndex);

/**
 * @constructor
 */
function Html5Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1) === 'x' ?
                parseInt(entity.substr(2).toLowerCase(), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.decode = function(str) {
    return new Html5Entities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var charInfo = charIndex[str.charCodeAt(i)];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        result += str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encode = function(str) {
    return new Html5Entities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var charInfo = charIndex[c];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonUTF = function(str) {
    return new Html5Entities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonASCII = function(str) {
    return new Html5Entities().encodeNonASCII(str);
 };

/**
 * @param {Object} alphaIndex Passed by reference.
 * @param {Object} charIndex Passed by reference.
 */
function createIndexes(alphaIndex, charIndex) {
    var i = ENTITIES.length;
    var _results = [];
    while (i--) {
        var e = ENTITIES[i];
        var alpha = e[0];
        var chars = e[1];
        var chr = chars[0];
        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
        var charInfo;
        if (addChar) {
            charInfo = charIndex[chr] = charIndex[chr] || {};
        }
        if (chars[1]) {
            var chr2 = chars[1];
            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
            _results.push(addChar && (charInfo[chr2] = alpha));
        } else {
            alphaIndex[alpha] = String.fromCharCode(chr);
            _results.push(addChar && (charInfo[''] = alpha));
        }
    }
}

module.exports = Html5Entities;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Observable_1 = __webpack_require__(106);
var map_1 = __webpack_require__(108);
Observable_1.Observable.prototype.map = map_1.map;
//# sourceMappingURL=map.js.map

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(37);

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(4);

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_reflect_metadata__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_reflect_metadata___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_reflect_metadata__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_zone_js__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_zone_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_zone_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_bootstrap__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_bootstrap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_bootstrap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser_dynamic__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_app_module_browser__ = __webpack_require__(20);






if (true) {
    module.hot.accept();
    module.hot.dispose(function () {
        // Before restarting the app, we create a new root element and dispose the old one
        var oldRootElem = document.querySelector('app');
        var newRootElem = document.createElement('app');
        oldRootElem.parentNode.insertBefore(newRootElem, oldRootElem);
        modulePromise.then(function (appModule) { return appModule.destroy(); });
    });
}
else {
    enableProdMode();
}
// Note: @ng-tools/webpack looks for the following expression when performing production
// builds. Don't change how this line looks, otherwise you may break tree-shaking.
var modulePromise = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__angular_platform_browser_dynamic__["platformBrowserDynamic"])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_5__app_app_module_browser__["a" /* AppModule */]);


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery, module) {/*eslint-env browser*/
/*global __resourceQuery __webpack_public_path__*/

var options = {
  path: "/__webpack_hmr",
  timeout: 20 * 1000,
  overlay: true,
  reload: false,
  log: true,
  warn: true,
  name: ''
};
if (true) {
  var querystring = __webpack_require__(86);
  var overrides = querystring.parse(__resourceQuery.slice(1));
  if (overrides.path) options.path = overrides.path;
  if (overrides.timeout) options.timeout = overrides.timeout;
  if (overrides.overlay) options.overlay = overrides.overlay !== 'false';
  if (overrides.reload) options.reload = overrides.reload !== 'false';
  if (overrides.noInfo && overrides.noInfo !== 'false') {
    options.log = false;
  }
  if (overrides.name) {
    options.name = overrides.name;
  }
  if (overrides.quiet && overrides.quiet !== 'false') {
    options.log = false;
    options.warn = false;
  }
  if (overrides.dynamicPublicPath) {
    options.path = __webpack_require__.p + options.path;
  }
}

if (typeof window === 'undefined') {
  // do nothing
} else if (typeof window.EventSource === 'undefined') {
  console.warn(
    "webpack-hot-middleware's client requires EventSource to work. " +
    "You should include a polyfill if you want to support this browser: " +
    "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools"
  );
} else {
  connect();
}

function EventSourceWrapper() {
  var source;
  var lastActivity = new Date();
  var listeners = [];

  init();
  var timer = setInterval(function() {
    if ((new Date() - lastActivity) > options.timeout) {
      handleDisconnect();
    }
  }, options.timeout / 2);

  function init() {
    source = new window.EventSource(options.path);
    source.onopen = handleOnline;
    source.onerror = handleDisconnect;
    source.onmessage = handleMessage;
  }

  function handleOnline() {
    if (options.log) console.log("[HMR] connected");
    lastActivity = new Date();
  }

  function handleMessage(event) {
    lastActivity = new Date();
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](event);
    }
  }

  function handleDisconnect() {
    clearInterval(timer);
    source.close();
    setTimeout(init, options.timeout);
  }

  return {
    addMessageListener: function(fn) {
      listeners.push(fn);
    }
  };
}

function getEventSourceWrapper() {
  if (!window.__whmEventSourceWrapper) {
    window.__whmEventSourceWrapper = {};
  }
  if (!window.__whmEventSourceWrapper[options.path]) {
    // cache the wrapper for other entries loaded on
    // the same page with the same options.path
    window.__whmEventSourceWrapper[options.path] = EventSourceWrapper();
  }
  return window.__whmEventSourceWrapper[options.path];
}

function connect() {
  getEventSourceWrapper().addMessageListener(handleMessage);

  function handleMessage(event) {
    if (event.data == "\uD83D\uDC93") {
      return;
    }
    try {
      processMessage(JSON.parse(event.data));
    } catch (ex) {
      if (options.warn) {
        console.warn("Invalid HMR message: " + event.data + "\n" + ex);
      }
    }
  }
}

// the reporter needs to be a singleton on the page
// in case the client is being used by multiple bundles
// we only want to report once.
// all the errors will go to all clients
var singletonKey = '__webpack_hot_middleware_reporter__';
var reporter;
if (typeof window !== 'undefined') {
  if (!window[singletonKey]) {
    window[singletonKey] = createReporter();
  }
  reporter = window[singletonKey];
}

function createReporter() {
  var strip = __webpack_require__(88);

  var overlay;
  if (typeof document !== 'undefined' && options.overlay) {
    overlay = __webpack_require__(103);
  }

  var styles = {
    errors: "color: #ff0000;",
    warnings: "color: #999933;"
  };
  var previousProblems = null;
  function log(type, obj) {
    var newProblems = obj[type].map(function(msg) { return strip(msg); }).join('\n');
    if (previousProblems == newProblems) {
      return;
    } else {
      previousProblems = newProblems;
    }

    var style = styles[type];
    var name = obj.name ? "'" + obj.name + "' " : "";
    var title = "[HMR] bundle " + name + "has " + obj[type].length + " " + type;
    // NOTE: console.warn or console.error will print the stack trace
    // which isn't helpful here, so using console.log to escape it.
    if (console.group && console.groupEnd) {
      console.group("%c" + title, style);
      console.log("%c" + newProblems, style);
      console.groupEnd();
    } else {
      console.log(
        "%c" + title + "\n\t%c" + newProblems.replace(/\n/g, "\n\t"),
        style + "font-weight: bold;",
        style + "font-weight: normal;"
      );
    }
  }

  return {
    cleanProblemsCache: function () {
      previousProblems = null;
    },
    problems: function(type, obj) {
      if (options.warn) {
        log(type, obj);
      }
      if (overlay && type !== 'warnings') overlay.showProblems(type, obj[type]);
    },
    success: function() {
      if (overlay) overlay.clear();
    },
    useCustomOverlay: function(customOverlay) {
      overlay = customOverlay;
    }
  };
}

var processUpdate = __webpack_require__(104);

var customHandler;
var subscribeAllHandler;
function processMessage(obj) {
  switch(obj.action) {
    case "building":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilding"
        );
      }
      break;
    case "built":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilt in " + obj.time + "ms"
        );
      }
      // fall through
    case "sync":
      if (obj.name && options.name && obj.name !== options.name) {
        return;
      }
      if (obj.errors.length > 0) {
        if (reporter) reporter.problems('errors', obj);
      } else {
        if (reporter) {
          if (obj.warnings.length > 0) {
            reporter.problems('warnings', obj);
          } else {
            reporter.cleanProblemsCache();
          }
          reporter.success();
        }
        processUpdate(obj.hash, obj.modules, options);
      }
      break;
    default:
      if (customHandler) {
        customHandler(obj);
      }
  }

  if (subscribeAllHandler) {
    subscribeAllHandler(obj);
  }
}

if (module) {
  module.exports = {
    subscribeAll: function subscribeAll(handler) {
      subscribeAllHandler = handler;
    },
    subscribe: function subscribe(handler) {
      customHandler = handler;
    },
    useCustomOverlay: function useCustomOverlay(customOverlay) {
      if (reporter) reporter.useCustomOverlay(customOverlay);
    }
  };
}

/* WEBPACK VAR INJECTION */}.call(exports, "?path=__webpack_hmr&dynamicPublicPath=true", __webpack_require__(105)(module)))

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(45);

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return AnimationDriver; });
/* unused harmony export ɵAnimation */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return AnimationStyleNormalizer; });
/* unused harmony export ɵNoopAnimationStyleNormalizer */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return WebAnimationsStyleNormalizer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return NoopAnimationDriver; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AnimationEngine; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return WebAnimationsDriver; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return supportsWebAnimations; });
/* unused harmony export ɵWebAnimationsPlayer */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_animations__ = __webpack_require__(12);

/**
 * @license Angular v4.4.6
 * (c) 2010-2017 Google, Inc. https://angular.io/
 * License: MIT
 */

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function optimizeGroupPlayer(players) {
    switch (players.length) {
        case 0:
            return new __WEBPACK_IMPORTED_MODULE_1__angular_animations__["NoopAnimationPlayer"]();
        case 1:
            return players[0];
        default:
            return new __WEBPACK_IMPORTED_MODULE_1__angular_animations__["ɵAnimationGroupPlayer"](players);
    }
}
function normalizeKeyframes(driver, normalizer, element, keyframes, preStyles, postStyles) {
    if (preStyles === void 0) { preStyles = {}; }
    if (postStyles === void 0) { postStyles = {}; }
    var errors = [];
    var normalizedKeyframes = [];
    var previousOffset = -1;
    var previousKeyframe = null;
    keyframes.forEach(function (kf) {
        var offset = kf['offset'];
        var isSameOffset = offset == previousOffset;
        var normalizedKeyframe = (isSameOffset && previousKeyframe) || {};
        Object.keys(kf).forEach(function (prop) {
            var normalizedProp = prop;
            var normalizedValue = kf[prop];
            if (prop !== 'offset') {
                normalizedProp = normalizer.normalizePropertyName(normalizedProp, errors);
                switch (normalizedValue) {
                    case __WEBPACK_IMPORTED_MODULE_1__angular_animations__["ɵPRE_STYLE"]:
                        normalizedValue = preStyles[prop];
                        break;
                    case __WEBPACK_IMPORTED_MODULE_1__angular_animations__["AUTO_STYLE"]:
                        normalizedValue = postStyles[prop];
                        break;
                    default:
                        normalizedValue =
                            normalizer.normalizeStyleValue(prop, normalizedProp, normalizedValue, errors);
                        break;
                }
            }
            normalizedKeyframe[normalizedProp] = normalizedValue;
        });
        if (!isSameOffset) {
            normalizedKeyframes.push(normalizedKeyframe);
        }
        previousKeyframe = normalizedKeyframe;
        previousOffset = offset;
    });
    if (errors.length) {
        var LINE_START = '\n - ';
        throw new Error("Unable to animate due to the following errors:" + LINE_START + errors.join(LINE_START));
    }
    return normalizedKeyframes;
}
function listenOnPlayer(player, eventName, event, callback) {
    switch (eventName) {
        case 'start':
            player.onStart(function () { return callback(event && copyAnimationEvent(event, 'start', player.totalTime)); });
            break;
        case 'done':
            player.onDone(function () { return callback(event && copyAnimationEvent(event, 'done', player.totalTime)); });
            break;
        case 'destroy':
            player.onDestroy(function () { return callback(event && copyAnimationEvent(event, 'destroy', player.totalTime)); });
            break;
    }
}
function copyAnimationEvent(e, phaseName, totalTime) {
    var event = makeAnimationEvent(e.element, e.triggerName, e.fromState, e.toState, phaseName || e.phaseName, totalTime == undefined ? e.totalTime : totalTime);
    var data = e['_data'];
    if (data != null) {
        event['_data'] = data;
    }
    return event;
}
function makeAnimationEvent(element, triggerName, fromState, toState, phaseName, totalTime) {
    if (phaseName === void 0) { phaseName = ''; }
    if (totalTime === void 0) { totalTime = 0; }
    return { element: element, triggerName: triggerName, fromState: fromState, toState: toState, phaseName: phaseName, totalTime: totalTime };
}
function getOrSetAsInMap(map, key, defaultValue) {
    var value;
    if (map instanceof Map) {
        value = map.get(key);
        if (!value) {
            map.set(key, value = defaultValue);
        }
    }
    else {
        value = map[key];
        if (!value) {
            value = map[key] = defaultValue;
        }
    }
    return value;
}
function parseTimelineCommand(command) {
    var separatorPos = command.indexOf(':');
    var id = command.substring(1, separatorPos);
    var action = command.substr(separatorPos + 1);
    return [id, action];
}
var _contains = function (elm1, elm2) { return false; };
var _matches = function (element, selector) { return false; };
var _query = function (element, selector, multi) {
    return [];
};
if (typeof Element != 'undefined') {
    // this is well supported in all browsers
    _contains = function (elm1, elm2) { return elm1.contains(elm2); };
    if (Element.prototype.matches) {
        _matches = function (element, selector) { return element.matches(selector); };
    }
    else {
        var proto = Element.prototype;
        var fn_1 = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector ||
            proto.oMatchesSelector || proto.webkitMatchesSelector;
        if (fn_1) {
            _matches = function (element, selector) { return fn_1.apply(element, [selector]); };
        }
    }
    _query = function (element, selector, multi) {
        var results = [];
        if (multi) {
            results.push.apply(results, element.querySelectorAll(selector));
        }
        else {
            var elm = element.querySelector(selector);
            if (elm) {
                results.push(elm);
            }
        }
        return results;
    };
}
var matchesElement = _matches;
var containsElement = _contains;
var invokeQuery = _query;
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @experimental
 */
var NoopAnimationDriver = (function () {
    function NoopAnimationDriver() {
    }
    NoopAnimationDriver.prototype.matchesElement = function (element, selector) {
        return matchesElement(element, selector);
    };
    NoopAnimationDriver.prototype.containsElement = function (elm1, elm2) { return containsElement(elm1, elm2); };
    NoopAnimationDriver.prototype.query = function (element, selector, multi) {
        return invokeQuery(element, selector, multi);
    };
    NoopAnimationDriver.prototype.computeStyle = function (element, prop, defaultValue) {
        return defaultValue || '';
    };
    NoopAnimationDriver.prototype.animate = function (element, keyframes, duration, delay, easing, previousPlayers) {
        if (previousPlayers === void 0) { previousPlayers = []; }
        return new __WEBPACK_IMPORTED_MODULE_1__angular_animations__["NoopAnimationPlayer"]();
    };
    return NoopAnimationDriver;
}());
/**
 * @experimental
 */
var AnimationDriver = (function () {
    function AnimationDriver() {
    }
    return AnimationDriver;
}());
AnimationDriver.NOOP = new NoopAnimationDriver();
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var ONE_SECOND = 1000;
var SUBSTITUTION_EXPR_START = '{{';
var SUBSTITUTION_EXPR_END = '}}';
var ENTER_CLASSNAME = 'ng-enter';
var LEAVE_CLASSNAME = 'ng-leave';
var ENTER_SELECTOR = '.ng-enter';
var LEAVE_SELECTOR = '.ng-leave';
var NG_TRIGGER_CLASSNAME = 'ng-trigger';
var NG_TRIGGER_SELECTOR = '.ng-trigger';
var NG_ANIMATING_CLASSNAME = 'ng-animating';
var NG_ANIMATING_SELECTOR = '.ng-animating';
function resolveTimingValue(value) {
    if (typeof value == 'number')
        return value;
    var matches = value.match(/^(-?[\.\d]+)(m?s)/);
    if (!matches || matches.length < 2)
        return 0;
    return _convertTimeValueToMS(parseFloat(matches[1]), matches[2]);
}
function _convertTimeValueToMS(value, unit) {
    switch (unit) {
        case 's':
            return value * ONE_SECOND;
        default:
            return value;
    }
}
function resolveTiming(timings, errors, allowNegativeValues) {
    return timings.hasOwnProperty('duration') ?
        timings :
        parseTimeExpression(timings, errors, allowNegativeValues);
}
function parseTimeExpression(exp, errors, allowNegativeValues) {
    var regex = /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i;
    var duration;
    var delay = 0;
    var easing = '';
    if (typeof exp === 'string') {
        var matches = exp.match(regex);
        if (matches === null) {
            errors.push("The provided timing value \"" + exp + "\" is invalid.");
            return { duration: 0, delay: 0, easing: '' };
        }
        duration = _convertTimeValueToMS(parseFloat(matches[1]), matches[2]);
        var delayMatch = matches[3];
        if (delayMatch != null) {
            delay = _convertTimeValueToMS(Math.floor(parseFloat(delayMatch)), matches[4]);
        }
        var easingVal = matches[5];
        if (easingVal) {
            easing = easingVal;
        }
    }
    else {
        duration = exp;
    }
    if (!allowNegativeValues) {
        var containsErrors = false;
        var startIndex = errors.length;
        if (duration < 0) {
            errors.push("Duration values below 0 are not allowed for this animation step.");
            containsErrors = true;
        }
        if (delay < 0) {
            errors.push("Delay values below 0 are not allowed for this animation step.");
            containsErrors = true;
        }
        if (containsErrors) {
            errors.splice(startIndex, 0, "The provided timing value \"" + exp + "\" is invalid.");
        }
    }
    return { duration: duration, delay: delay, easing: easing };
}
function copyObj(obj, destination) {
    if (destination === void 0) { destination = {}; }
    Object.keys(obj).forEach(function (prop) { destination[prop] = obj[prop]; });
    return destination;
}
function normalizeStyles(styles) {
    var normalizedStyles = {};
    if (Array.isArray(styles)) {
        styles.forEach(function (data) { return copyStyles(data, false, normalizedStyles); });
    }
    else {
        copyStyles(styles, false, normalizedStyles);
    }
    return normalizedStyles;
}
function copyStyles(styles, readPrototype, destination) {
    if (destination === void 0) { destination = {}; }
    if (readPrototype) {
        // we make use of a for-in loop so that the
        // prototypically inherited properties are
        // revealed from the backFill map
        for (var prop in styles) {
            destination[prop] = styles[prop];
        }
    }
    else {
        copyObj(styles, destination);
    }
    return destination;
}
function setStyles(element, styles) {
    if (element['style']) {
        Object.keys(styles).forEach(function (prop) {
            var camelProp = dashCaseToCamelCase(prop);
            element.style[camelProp] = styles[prop];
        });
    }
}
function eraseStyles(element, styles) {
    if (element['style']) {
        Object.keys(styles).forEach(function (prop) {
            var camelProp = dashCaseToCamelCase(prop);
            element.style[camelProp] = '';
        });
    }
}
function normalizeAnimationEntry(steps) {
    if (Array.isArray(steps)) {
        if (steps.length == 1)
            return steps[0];
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["sequence"])(steps);
    }
    return steps;
}
function validateStyleParams(value, options, errors) {
    var params = options.params || {};
    var matches = extractStyleParams(value);
    if (matches.length) {
        matches.forEach(function (varName) {
            if (!params.hasOwnProperty(varName)) {
                errors.push("Unable to resolve the local animation param " + varName + " in the given list of values");
            }
        });
    }
}
var PARAM_REGEX = new RegExp(SUBSTITUTION_EXPR_START + "\\s*(.+?)\\s*" + SUBSTITUTION_EXPR_END, 'g');
function extractStyleParams(value) {
    var params = [];
    if (typeof value === 'string') {
        var val = value.toString();
        var match = void 0;
        while (match = PARAM_REGEX.exec(val)) {
            params.push(match[1]);
        }
        PARAM_REGEX.lastIndex = 0;
    }
    return params;
}
function interpolateParams(value, params, errors) {
    var original = value.toString();
    var str = original.replace(PARAM_REGEX, function (_, varName) {
        var localVal = params[varName];
        // this means that the value was never overidden by the data passed in by the user
        if (!params.hasOwnProperty(varName)) {
            errors.push("Please provide a value for the animation param " + varName);
            localVal = '';
        }
        return localVal.toString();
    });
    // we do this to assert that numeric values stay as they are
    return str == original ? value : str;
}
function iteratorToArray(iterator) {
    var arr = [];
    var item = iterator.next();
    while (!item.done) {
        arr.push(item.value);
        item = iterator.next();
    }
    return arr;
}
var DASH_CASE_REGEXP = /-+([a-z0-9])/g;
function dashCaseToCamelCase(input) {
    return input.replace(DASH_CASE_REGEXP, function () {
        var m = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            m[_i] = arguments[_i];
        }
        return m[1].toUpperCase();
    });
}
function allowPreviousPlayerStylesMerge(duration, delay) {
    return duration === 0 || delay === 0;
}
function visitDslNode(visitor, node, context) {
    switch (node.type) {
        case 7 /* Trigger */:
            return visitor.visitTrigger(node, context);
        case 0 /* State */:
            return visitor.visitState(node, context);
        case 1 /* Transition */:
            return visitor.visitTransition(node, context);
        case 2 /* Sequence */:
            return visitor.visitSequence(node, context);
        case 3 /* Group */:
            return visitor.visitGroup(node, context);
        case 4 /* Animate */:
            return visitor.visitAnimate(node, context);
        case 5 /* Keyframes */:
            return visitor.visitKeyframes(node, context);
        case 6 /* Style */:
            return visitor.visitStyle(node, context);
        case 8 /* Reference */:
            return visitor.visitReference(node, context);
        case 9 /* AnimateChild */:
            return visitor.visitAnimateChild(node, context);
        case 10 /* AnimateRef */:
            return visitor.visitAnimateRef(node, context);
        case 11 /* Query */:
            return visitor.visitQuery(node, context);
        case 12 /* Stagger */:
            return visitor.visitStagger(node, context);
        default:
            throw new Error("Unable to resolve animation metadata node #" + node.type);
    }
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var ANY_STATE = '*';
/**
 * @param {?} transitionValue
 * @param {?} errors
 * @return {?}
 */
function parseTransitionExpr(transitionValue, errors) {
    var /** @type {?} */ expressions = [];
    if (typeof transitionValue == 'string') {
        ((transitionValue))
            .split(/\s*,\s*/)
            .forEach(function (str) { return parseInnerTransitionStr(str, expressions, errors); });
    }
    else {
        expressions.push(/** @type {?} */ (transitionValue));
    }
    return expressions;
}
/**
 * @param {?} eventStr
 * @param {?} expressions
 * @param {?} errors
 * @return {?}
 */
function parseInnerTransitionStr(eventStr, expressions, errors) {
    if (eventStr[0] == ':') {
        eventStr = parseAnimationAlias(eventStr, errors);
    }
    var /** @type {?} */ match = eventStr.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
    if (match == null || match.length < 4) {
        errors.push("The provided transition expression \"" + eventStr + "\" is not supported");
        return expressions;
    }
    var /** @type {?} */ fromState = match[1];
    var /** @type {?} */ separator = match[2];
    var /** @type {?} */ toState = match[3];
    expressions.push(makeLambdaFromStates(fromState, toState));
    var /** @type {?} */ isFullAnyStateExpr = fromState == ANY_STATE && toState == ANY_STATE;
    if (separator[0] == '<' && !isFullAnyStateExpr) {
        expressions.push(makeLambdaFromStates(toState, fromState));
    }
}
/**
 * @param {?} alias
 * @param {?} errors
 * @return {?}
 */
function parseAnimationAlias(alias, errors) {
    switch (alias) {
        case ':enter':
            return 'void => *';
        case ':leave':
            return '* => void';
        default:
            errors.push("The transition alias value \"" + alias + "\" is not supported");
            return '* => *';
    }
}
var TRUE_BOOLEAN_VALUES = new Set();
TRUE_BOOLEAN_VALUES.add('true');
TRUE_BOOLEAN_VALUES.add('1');
var FALSE_BOOLEAN_VALUES = new Set();
FALSE_BOOLEAN_VALUES.add('false');
FALSE_BOOLEAN_VALUES.add('0');
/**
 * @param {?} lhs
 * @param {?} rhs
 * @return {?}
 */
function makeLambdaFromStates(lhs, rhs) {
    var /** @type {?} */ LHS_MATCH_BOOLEAN = TRUE_BOOLEAN_VALUES.has(lhs) || FALSE_BOOLEAN_VALUES.has(lhs);
    var /** @type {?} */ RHS_MATCH_BOOLEAN = TRUE_BOOLEAN_VALUES.has(rhs) || FALSE_BOOLEAN_VALUES.has(rhs);
    return function (fromState, toState) {
        var /** @type {?} */ lhsMatch = lhs == ANY_STATE || lhs == fromState;
        var /** @type {?} */ rhsMatch = rhs == ANY_STATE || rhs == toState;
        if (!lhsMatch && LHS_MATCH_BOOLEAN && typeof fromState === 'boolean') {
            lhsMatch = fromState ? TRUE_BOOLEAN_VALUES.has(lhs) : FALSE_BOOLEAN_VALUES.has(lhs);
        }
        if (!rhsMatch && RHS_MATCH_BOOLEAN && typeof toState === 'boolean') {
            rhsMatch = toState ? TRUE_BOOLEAN_VALUES.has(rhs) : FALSE_BOOLEAN_VALUES.has(rhs);
        }
        return lhsMatch && rhsMatch;
    };
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var SELF_TOKEN = ':self';
var SELF_TOKEN_REGEX = new RegExp("s*" + SELF_TOKEN + "s*,?", 'g');
/**
 * @param {?} metadata
 * @param {?} errors
 * @return {?}
 */
function buildAnimationAst(metadata, errors) {
    return new AnimationAstBuilderVisitor().build(metadata, errors);
}
var LEAVE_TOKEN = ':leave';
var LEAVE_TOKEN_REGEX = new RegExp(LEAVE_TOKEN, 'g');
var ENTER_TOKEN = ':enter';
var ENTER_TOKEN_REGEX = new RegExp(ENTER_TOKEN, 'g');
var ROOT_SELECTOR = '';
var AnimationAstBuilderVisitor = (function () {
    function AnimationAstBuilderVisitor() {
    }
    /**
     * @param {?} metadata
     * @param {?} errors
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.build = function (metadata, errors) {
        var /** @type {?} */ context = new AnimationAstBuilderContext(errors);
        this._resetContextStyleTimingState(context);
        return (visitDslNode(this, normalizeAnimationEntry(metadata), context));
    };
    /**
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype._resetContextStyleTimingState = function (context) {
        context.currentQuerySelector = ROOT_SELECTOR;
        context.collectedStyles = {};
        context.collectedStyles[ROOT_SELECTOR] = {};
        context.currentTime = 0;
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.visitTrigger = function (metadata, context) {
        var _this = this;
        var /** @type {?} */ queryCount = context.queryCount = 0;
        var /** @type {?} */ depCount = context.depCount = 0;
        var /** @type {?} */ states = [];
        var /** @type {?} */ transitions = [];
        metadata.definitions.forEach(function (def) {
            _this._resetContextStyleTimingState(context);
            if (def.type == 0 /* State */) {
                var /** @type {?} */ stateDef_1 = (def);
                var /** @type {?} */ name = stateDef_1.name;
                name.split(/\s*,\s*/).forEach(function (n) {
                    stateDef_1.name = n;
                    states.push(_this.visitState(stateDef_1, context));
                });
                stateDef_1.name = name;
            }
            else if (def.type == 1 /* Transition */) {
                var /** @type {?} */ transition = _this.visitTransition(/** @type {?} */ (def), context);
                queryCount += transition.queryCount;
                depCount += transition.depCount;
                transitions.push(transition);
            }
            else {
                context.errors.push('only state() and transition() definitions can sit inside of a trigger()');
            }
        });
        return {
            type: 7 /* Trigger */,
            name: metadata.name, states: states, transitions: transitions, queryCount: queryCount, depCount: depCount,
            options: null
        };
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.visitState = function (metadata, context) {
        var /** @type {?} */ styleAst = this.visitStyle(metadata.styles, context);
        var /** @type {?} */ astParams = (metadata.options && metadata.options.params) || null;
        if (styleAst.containsDynamicStyles) {
            var /** @type {?} */ missingSubs_1 = new Set();
            var /** @type {?} */ params_1 = astParams || {};
            styleAst.styles.forEach(function (value) {
                if (isObject(value)) {
                    var /** @type {?} */ stylesObj_1 = (value);
                    Object.keys(stylesObj_1).forEach(function (prop) {
                        extractStyleParams(stylesObj_1[prop]).forEach(function (sub) {
                            if (!params_1.hasOwnProperty(sub)) {
                                missingSubs_1.add(sub);
                            }
                        });
                    });
                }
            });
            if (missingSubs_1.size) {
                var /** @type {?} */ missingSubsArr = iteratorToArray(missingSubs_1.values());
                context.errors.push("state(\"" + metadata.name + "\", ...) must define default values for all the following style substitutions: " + missingSubsArr.join(', '));
            }
        }
        return {
            type: 0 /* State */,
            name: metadata.name,
            style: styleAst,
            options: astParams ? { params: astParams } : null
        };
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.visitTransition = function (metadata, context) {
        context.queryCount = 0;
        context.depCount = 0;
        var /** @type {?} */ animation = visitDslNode(this, normalizeAnimationEntry(metadata.animation), context);
        var /** @type {?} */ matchers = parseTransitionExpr(metadata.expr, context.errors);
        return {
            type: 1 /* Transition */,
            matchers: matchers,
            animation: animation,
            queryCount: context.queryCount,
            depCount: context.depCount,
            options: normalizeAnimationOptions(metadata.options)
        };
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.visitSequence = function (metadata, context) {
        var _this = this;
        return {
            type: 2 /* Sequence */,
            steps: metadata.steps.map(function (s) { return visitDslNode(_this, s, context); }),
            options: normalizeAnimationOptions(metadata.options)
        };
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.visitGroup = function (metadata, context) {
        var _this = this;
        var /** @type {?} */ currentTime = context.currentTime;
        var /** @type {?} */ furthestTime = 0;
        var /** @type {?} */ steps = metadata.steps.map(function (step) {
            context.currentTime = currentTime;
            var /** @type {?} */ innerAst = visitDslNode(_this, step, context);
            furthestTime = Math.max(furthestTime, context.currentTime);
            return innerAst;
        });
        context.currentTime = furthestTime;
        return {
            type: 3 /* Group */,
            steps: steps,
            options: normalizeAnimationOptions(metadata.options)
        };
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.visitAnimate = function (metadata, context) {
        var /** @type {?} */ timingAst = constructTimingAst(metadata.timings, context.errors);
        context.currentAnimateTimings = timingAst;
        var /** @type {?} */ styleAst;
        var /** @type {?} */ styleMetadata = metadata.styles ? metadata.styles : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({});
        if (styleMetadata.type == 5 /* Keyframes */) {
            styleAst = this.visitKeyframes(/** @type {?} */ (styleMetadata), context);
        }
        else {
            var /** @type {?} */ styleMetadata_1 = (metadata.styles);
            var /** @type {?} */ isEmpty = false;
            if (!styleMetadata_1) {
                isEmpty = true;
                var /** @type {?} */ newStyleData = {};
                if (timingAst.easing) {
                    newStyleData['easing'] = timingAst.easing;
                }
                styleMetadata_1 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])(newStyleData);
            }
            context.currentTime += timingAst.duration + timingAst.delay;
            var /** @type {?} */ _styleAst = this.visitStyle(styleMetadata_1, context);
            _styleAst.isEmptyStep = isEmpty;
            styleAst = _styleAst;
        }
        context.currentAnimateTimings = null;
        return {
            type: 4 /* Animate */,
            timings: timingAst,
            style: styleAst,
            options: null
        };
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.visitStyle = function (metadata, context) {
        var /** @type {?} */ ast = this._makeStyleAst(metadata, context);
        this._validateStyleAst(ast, context);
        return ast;
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype._makeStyleAst = function (metadata, context) {
        var /** @type {?} */ styles = [];
        if (Array.isArray(metadata.styles)) {
            ((metadata.styles)).forEach(function (styleTuple) {
                if (typeof styleTuple == 'string') {
                    if (styleTuple == __WEBPACK_IMPORTED_MODULE_1__angular_animations__["AUTO_STYLE"]) {
                        styles.push(/** @type {?} */ (styleTuple));
                    }
                    else {
                        context.errors.push("The provided style string value " + styleTuple + " is not allowed.");
                    }
                }
                else {
                    styles.push(/** @type {?} */ (styleTuple));
                }
            });
        }
        else {
            styles.push(metadata.styles);
        }
        var /** @type {?} */ containsDynamicStyles = false;
        var /** @type {?} */ collectedEasing = null;
        styles.forEach(function (styleData) {
            if (isObject(styleData)) {
                var /** @type {?} */ styleMap = (styleData);
                var /** @type {?} */ easing = styleMap['easing'];
                if (easing) {
                    collectedEasing = (easing);
                    delete styleMap['easing'];
                }
                if (!containsDynamicStyles) {
                    for (var /** @type {?} */ prop in styleMap) {
                        var /** @type {?} */ value = styleMap[prop];
                        if (value.toString().indexOf(SUBSTITUTION_EXPR_START) >= 0) {
                            containsDynamicStyles = true;
                            break;
                        }
                    }
                }
            }
        });
        return {
            type: 6 /* Style */,
            styles: styles,
            easing: collectedEasing,
            offset: metadata.offset, containsDynamicStyles: containsDynamicStyles,
            options: null
        };
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype._validateStyleAst = function (ast, context) {
        var /** @type {?} */ timings = context.currentAnimateTimings;
        var /** @type {?} */ endTime = context.currentTime;
        var /** @type {?} */ startTime = context.currentTime;
        if (timings && startTime > 0) {
            startTime -= timings.duration + timings.delay;
        }
        ast.styles.forEach(function (tuple) {
            if (typeof tuple == 'string')
                return;
            Object.keys(tuple).forEach(function (prop) {
                var /** @type {?} */ collectedStyles = context.collectedStyles[((context.currentQuerySelector))];
                var /** @type {?} */ collectedEntry = collectedStyles[prop];
                var /** @type {?} */ updateCollectedStyle = true;
                if (collectedEntry) {
                    if (startTime != endTime && startTime >= collectedEntry.startTime &&
                        endTime <= collectedEntry.endTime) {
                        context.errors.push("The CSS property \"" + prop + "\" that exists between the times of \"" + collectedEntry.startTime + "ms\" and \"" + collectedEntry.endTime + "ms\" is also being animated in a parallel animation between the times of \"" + startTime + "ms\" and \"" + endTime + "ms\"");
                        updateCollectedStyle = false;
                    }
                    // we always choose the smaller start time value since we
                    // want to have a record of the entire animation window where
                    // the style property is being animated in between
                    startTime = collectedEntry.startTime;
                }
                if (updateCollectedStyle) {
                    collectedStyles[prop] = { startTime: startTime, endTime: endTime };
                }
                if (context.options) {
                    validateStyleParams(tuple[prop], context.options, context.errors);
                }
            });
        });
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.visitKeyframes = function (metadata, context) {
        var _this = this;
        var /** @type {?} */ ast = { type: 5 /* Keyframes */, styles: [], options: null };
        if (!context.currentAnimateTimings) {
            context.errors.push("keyframes() must be placed inside of a call to animate()");
            return ast;
        }
        var /** @type {?} */ MAX_KEYFRAME_OFFSET = 1;
        var /** @type {?} */ totalKeyframesWithOffsets = 0;
        var /** @type {?} */ offsets = [];
        var /** @type {?} */ offsetsOutOfOrder = false;
        var /** @type {?} */ keyframesOutOfRange = false;
        var /** @type {?} */ previousOffset = 0;
        var /** @type {?} */ keyframes = metadata.steps.map(function (styles) {
            var /** @type {?} */ style$$1 = _this._makeStyleAst(styles, context);
            var /** @type {?} */ offsetVal = style$$1.offset != null ? style$$1.offset : consumeOffset(style$$1.styles);
            var /** @type {?} */ offset = 0;
            if (offsetVal != null) {
                totalKeyframesWithOffsets++;
                offset = style$$1.offset = offsetVal;
            }
            keyframesOutOfRange = keyframesOutOfRange || offset < 0 || offset > 1;
            offsetsOutOfOrder = offsetsOutOfOrder || offset < previousOffset;
            previousOffset = offset;
            offsets.push(offset);
            return style$$1;
        });
        if (keyframesOutOfRange) {
            context.errors.push("Please ensure that all keyframe offsets are between 0 and 1");
        }
        if (offsetsOutOfOrder) {
            context.errors.push("Please ensure that all keyframe offsets are in order");
        }
        var /** @type {?} */ length = metadata.steps.length;
        var /** @type {?} */ generatedOffset = 0;
        if (totalKeyframesWithOffsets > 0 && totalKeyframesWithOffsets < length) {
            context.errors.push("Not all style() steps within the declared keyframes() contain offsets");
        }
        else if (totalKeyframesWithOffsets == 0) {
            generatedOffset = MAX_KEYFRAME_OFFSET / (length - 1);
        }
        var /** @type {?} */ limit = length - 1;
        var /** @type {?} */ currentTime = context.currentTime;
        var /** @type {?} */ currentAnimateTimings = ((context.currentAnimateTimings));
        var /** @type {?} */ animateDuration = currentAnimateTimings.duration;
        keyframes.forEach(function (kf, i) {
            var /** @type {?} */ offset = generatedOffset > 0 ? (i == limit ? 1 : (generatedOffset * i)) : offsets[i];
            var /** @type {?} */ durationUpToThisFrame = offset * animateDuration;
            context.currentTime = currentTime + currentAnimateTimings.delay + durationUpToThisFrame;
            currentAnimateTimings.duration = durationUpToThisFrame;
            _this._validateStyleAst(kf, context);
            kf.offset = offset;
            ast.styles.push(kf);
        });
        return ast;
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.visitReference = function (metadata, context) {
        return {
            type: 8 /* Reference */,
            animation: visitDslNode(this, normalizeAnimationEntry(metadata.animation), context),
            options: normalizeAnimationOptions(metadata.options)
        };
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.visitAnimateChild = function (metadata, context) {
        context.depCount++;
        return {
            type: 9 /* AnimateChild */,
            options: normalizeAnimationOptions(metadata.options)
        };
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.visitAnimateRef = function (metadata, context) {
        return {
            type: 10 /* AnimateRef */,
            animation: this.visitReference(metadata.animation, context),
            options: normalizeAnimationOptions(metadata.options)
        };
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.visitQuery = function (metadata, context) {
        var /** @type {?} */ parentSelector = ((context.currentQuerySelector));
        var /** @type {?} */ options = ((metadata.options || {}));
        context.queryCount++;
        context.currentQuery = metadata;
        var _a = normalizeSelector(metadata.selector), selector = _a[0], includeSelf = _a[1];
        context.currentQuerySelector =
            parentSelector.length ? (parentSelector + ' ' + selector) : selector;
        getOrSetAsInMap(context.collectedStyles, context.currentQuerySelector, {});
        var /** @type {?} */ animation = visitDslNode(this, normalizeAnimationEntry(metadata.animation), context);
        context.currentQuery = null;
        context.currentQuerySelector = parentSelector;
        return {
            type: 11 /* Query */,
            selector: selector,
            limit: options.limit || 0,
            optional: !!options.optional, includeSelf: includeSelf, animation: animation,
            originalSelector: metadata.selector,
            options: normalizeAnimationOptions(metadata.options)
        };
    };
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    AnimationAstBuilderVisitor.prototype.visitStagger = function (metadata, context) {
        if (!context.currentQuery) {
            context.errors.push("stagger() can only be used inside of query()");
        }
        var /** @type {?} */ timings = metadata.timings === 'full' ?
            { duration: 0, delay: 0, easing: 'full' } :
            resolveTiming(metadata.timings, context.errors, true);
        return {
            type: 12 /* Stagger */,
            animation: visitDslNode(this, normalizeAnimationEntry(metadata.animation), context), timings: timings,
            options: null
        };
    };
    return AnimationAstBuilderVisitor;
}());
/**
 * @param {?} selector
 * @return {?}
 */
function normalizeSelector(selector) {
    var /** @type {?} */ hasAmpersand = selector.split(/\s*,\s*/).find(function (token) { return token == SELF_TOKEN; }) ? true : false;
    if (hasAmpersand) {
        selector = selector.replace(SELF_TOKEN_REGEX, '');
    }
    selector = selector.replace(ENTER_TOKEN_REGEX, ENTER_SELECTOR)
        .replace(LEAVE_TOKEN_REGEX, LEAVE_SELECTOR)
        .replace(/@\*/g, NG_TRIGGER_SELECTOR)
        .replace(/@\w+/g, function (match) { return NG_TRIGGER_SELECTOR + '-' + match.substr(1); })
        .replace(/:animating/g, NG_ANIMATING_SELECTOR);
    return [selector, hasAmpersand];
}
/**
 * @param {?} obj
 * @return {?}
 */
function normalizeParams(obj) {
    return obj ? copyObj(obj) : null;
}
var AnimationAstBuilderContext = (function () {
    /**
     * @param {?} errors
     */
    function AnimationAstBuilderContext(errors) {
        this.errors = errors;
        this.queryCount = 0;
        this.depCount = 0;
        this.currentTransition = null;
        this.currentQuery = null;
        this.currentQuerySelector = null;
        this.currentAnimateTimings = null;
        this.currentTime = 0;
        this.collectedStyles = {};
        this.options = null;
    }
    return AnimationAstBuilderContext;
}());
/**
 * @param {?} styles
 * @return {?}
 */
function consumeOffset(styles) {
    if (typeof styles == 'string')
        return null;
    var /** @type {?} */ offset = null;
    if (Array.isArray(styles)) {
        styles.forEach(function (styleTuple) {
            if (isObject(styleTuple) && styleTuple.hasOwnProperty('offset')) {
                var /** @type {?} */ obj = (styleTuple);
                offset = parseFloat(/** @type {?} */ (obj['offset']));
                delete obj['offset'];
            }
        });
    }
    else if (isObject(styles) && styles.hasOwnProperty('offset')) {
        var /** @type {?} */ obj = (styles);
        offset = parseFloat(/** @type {?} */ (obj['offset']));
        delete obj['offset'];
    }
    return offset;
}
/**
 * @param {?} value
 * @return {?}
 */
function isObject(value) {
    return !Array.isArray(value) && typeof value == 'object';
}
/**
 * @param {?} value
 * @param {?} errors
 * @return {?}
 */
function constructTimingAst(value, errors) {
    var /** @type {?} */ timings = null;
    if (value.hasOwnProperty('duration')) {
        timings = (value);
    }
    else if (typeof value == 'number') {
        var /** @type {?} */ duration = resolveTiming(/** @type {?} */ (value), errors).duration;
        return makeTimingAst(/** @type {?} */ (duration), 0, '');
    }
    var /** @type {?} */ strValue = (value);
    var /** @type {?} */ isDynamic = strValue.split(/\s+/).some(function (v) { return v.charAt(0) == '{' && v.charAt(1) == '{'; });
    if (isDynamic) {
        var /** @type {?} */ ast = (makeTimingAst(0, 0, ''));
        ast.dynamic = true;
        ast.strValue = strValue;
        return (ast);
    }
    timings = timings || resolveTiming(strValue, errors);
    return makeTimingAst(timings.duration, timings.delay, timings.easing);
}
/**
 * @param {?} options
 * @return {?}
 */
function normalizeAnimationOptions(options) {
    if (options) {
        options = copyObj(options);
        if (options['params']) {
            options['params'] = ((normalizeParams(options['params'])));
        }
    }
    else {
        options = {};
    }
    return options;
}
/**
 * @param {?} duration
 * @param {?} delay
 * @param {?} easing
 * @return {?}
 */
function makeTimingAst(duration, delay, easing) {
    return { duration: duration, delay: delay, easing: easing };
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @param {?} element
 * @param {?} keyframes
 * @param {?} preStyleProps
 * @param {?} postStyleProps
 * @param {?} duration
 * @param {?} delay
 * @param {?=} easing
 * @param {?=} subTimeline
 * @return {?}
 */
function createTimelineInstruction(element, keyframes, preStyleProps, postStyleProps, duration, delay, easing, subTimeline) {
    if (easing === void 0) { easing = null; }
    if (subTimeline === void 0) { subTimeline = false; }
    return {
        type: 1 /* TimelineAnimation */,
        element: element,
        keyframes: keyframes,
        preStyleProps: preStyleProps,
        postStyleProps: postStyleProps,
        duration: duration,
        delay: delay,
        totalTime: duration + delay, easing: easing, subTimeline: subTimeline
    };
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var ElementInstructionMap = (function () {
    function ElementInstructionMap() {
        this._map = new Map();
    }
    /**
     * @param {?} element
     * @return {?}
     */
    ElementInstructionMap.prototype.consume = function (element) {
        var /** @type {?} */ instructions = this._map.get(element);
        if (instructions) {
            this._map.delete(element);
        }
        else {
            instructions = [];
        }
        return instructions;
    };
    /**
     * @param {?} element
     * @param {?} instructions
     * @return {?}
     */
    ElementInstructionMap.prototype.append = function (element, instructions) {
        var /** @type {?} */ existingInstructions = this._map.get(element);
        if (!existingInstructions) {
            this._map.set(element, existingInstructions = []);
        }
        existingInstructions.push.apply(existingInstructions, instructions);
    };
    /**
     * @param {?} element
     * @return {?}
     */
    ElementInstructionMap.prototype.has = function (element) { return this._map.has(element); };
    /**
     * @return {?}
     */
    ElementInstructionMap.prototype.clear = function () { this._map.clear(); };
    return ElementInstructionMap;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var ONE_FRAME_IN_MILLISECONDS = 1;
/**
 * @param {?} driver
 * @param {?} rootElement
 * @param {?} ast
 * @param {?=} startingStyles
 * @param {?=} finalStyles
 * @param {?=} options
 * @param {?=} subInstructions
 * @param {?=} errors
 * @return {?}
 */
function buildAnimationTimelines(driver, rootElement, ast, startingStyles, finalStyles, options, subInstructions, errors) {
    if (startingStyles === void 0) { startingStyles = {}; }
    if (finalStyles === void 0) { finalStyles = {}; }
    if (errors === void 0) { errors = []; }
    return new AnimationTimelineBuilderVisitor().buildKeyframes(driver, rootElement, ast, startingStyles, finalStyles, options, subInstructions, errors);
}
var AnimationTimelineBuilderVisitor = (function () {
    function AnimationTimelineBuilderVisitor() {
    }
    /**
     * @param {?} driver
     * @param {?} rootElement
     * @param {?} ast
     * @param {?} startingStyles
     * @param {?} finalStyles
     * @param {?} options
     * @param {?=} subInstructions
     * @param {?=} errors
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.buildKeyframes = function (driver, rootElement, ast, startingStyles, finalStyles, options, subInstructions, errors) {
        if (errors === void 0) { errors = []; }
        subInstructions = subInstructions || new ElementInstructionMap();
        var /** @type {?} */ context = new AnimationTimelineContext(driver, rootElement, subInstructions, errors, []);
        context.options = options;
        context.currentTimeline.setStyles([startingStyles], null, context.errors, options);
        visitDslNode(this, ast, context);
        // this checks to see if an actual animation happened
        var /** @type {?} */ timelines = context.timelines.filter(function (timeline) { return timeline.containsAnimation(); });
        if (timelines.length && Object.keys(finalStyles).length) {
            var /** @type {?} */ tl = timelines[timelines.length - 1];
            if (!tl.allowOnlyTimelineStyles()) {
                tl.setStyles([finalStyles], null, context.errors, options);
            }
        }
        return timelines.length ? timelines.map(function (timeline) { return timeline.buildKeyframes(); }) :
            [createTimelineInstruction(rootElement, [], [], [], 0, 0, '', false)];
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.visitTrigger = function (ast, context) {
        // these values are not visited in this AST
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.visitState = function (ast, context) {
        // these values are not visited in this AST
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.visitTransition = function (ast, context) {
        // these values are not visited in this AST
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.visitAnimateChild = function (ast, context) {
        var /** @type {?} */ elementInstructions = context.subInstructions.consume(context.element);
        if (elementInstructions) {
            var /** @type {?} */ innerContext = context.createSubContext(ast.options);
            var /** @type {?} */ startTime = context.currentTimeline.currentTime;
            var /** @type {?} */ endTime = this._visitSubInstructions(elementInstructions, innerContext, /** @type {?} */ (innerContext.options));
            if (startTime != endTime) {
                // we do this on the upper context because we created a sub context for
                // the sub child animations
                context.transformIntoNewTimeline(endTime);
            }
        }
        context.previousNode = ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.visitAnimateRef = function (ast, context) {
        var /** @type {?} */ innerContext = context.createSubContext(ast.options);
        innerContext.transformIntoNewTimeline();
        this.visitReference(ast.animation, innerContext);
        context.transformIntoNewTimeline(innerContext.currentTimeline.currentTime);
        context.previousNode = ast;
    };
    /**
     * @param {?} instructions
     * @param {?} context
     * @param {?} options
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype._visitSubInstructions = function (instructions, context, options) {
        var /** @type {?} */ startTime = context.currentTimeline.currentTime;
        var /** @type {?} */ furthestTime = startTime;
        // this is a special-case for when a user wants to skip a sub
        // animation from being fired entirely.
        var /** @type {?} */ duration = options.duration != null ? resolveTimingValue(options.duration) : null;
        var /** @type {?} */ delay = options.delay != null ? resolveTimingValue(options.delay) : null;
        if (duration !== 0) {
            instructions.forEach(function (instruction) {
                var /** @type {?} */ instructionTimings = context.appendInstructionToTimeline(instruction, duration, delay);
                furthestTime =
                    Math.max(furthestTime, instructionTimings.duration + instructionTimings.delay);
            });
        }
        return furthestTime;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.visitReference = function (ast, context) {
        context.updateOptions(ast.options, true);
        visitDslNode(this, ast.animation, context);
        context.previousNode = ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.visitSequence = function (ast, context) {
        var _this = this;
        var /** @type {?} */ subContextCount = context.subContextCount;
        var /** @type {?} */ ctx = context;
        var /** @type {?} */ options = ast.options;
        if (options && (options.params || options.delay)) {
            ctx = context.createSubContext(options);
            ctx.transformIntoNewTimeline();
            if (options.delay != null) {
                if (ctx.previousNode.type == 6 /* Style */) {
                    ctx.currentTimeline.snapshotCurrentStyles();
                    ctx.previousNode = DEFAULT_NOOP_PREVIOUS_NODE;
                }
                var /** @type {?} */ delay = resolveTimingValue(options.delay);
                ctx.delayNextStep(delay);
            }
        }
        if (ast.steps.length) {
            ast.steps.forEach(function (s) { return visitDslNode(_this, s, ctx); });
            // this is here just incase the inner steps only contain or end with a style() call
            ctx.currentTimeline.applyStylesToKeyframe();
            // this means that some animation function within the sequence
            // ended up creating a sub timeline (which means the current
            // timeline cannot overlap with the contents of the sequence)
            if (ctx.subContextCount > subContextCount) {
                ctx.transformIntoNewTimeline();
            }
        }
        context.previousNode = ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.visitGroup = function (ast, context) {
        var _this = this;
        var /** @type {?} */ innerTimelines = [];
        var /** @type {?} */ furthestTime = context.currentTimeline.currentTime;
        var /** @type {?} */ delay = ast.options && ast.options.delay ? resolveTimingValue(ast.options.delay) : 0;
        ast.steps.forEach(function (s) {
            var /** @type {?} */ innerContext = context.createSubContext(ast.options);
            if (delay) {
                innerContext.delayNextStep(delay);
            }
            visitDslNode(_this, s, innerContext);
            furthestTime = Math.max(furthestTime, innerContext.currentTimeline.currentTime);
            innerTimelines.push(innerContext.currentTimeline);
        });
        // this operation is run after the AST loop because otherwise
        // if the parent timeline's collected styles were updated then
        // it would pass in invalid data into the new-to-be forked items
        innerTimelines.forEach(function (timeline) { return context.currentTimeline.mergeTimelineCollectedStyles(timeline); });
        context.transformIntoNewTimeline(furthestTime);
        context.previousNode = ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype._visitTiming = function (ast, context) {
        if (((ast)).dynamic) {
            var /** @type {?} */ strValue = ((ast)).strValue;
            var /** @type {?} */ timingValue = context.params ? interpolateParams(strValue, context.params, context.errors) : strValue;
            return resolveTiming(timingValue, context.errors);
        }
        else {
            return { duration: ast.duration, delay: ast.delay, easing: ast.easing };
        }
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.visitAnimate = function (ast, context) {
        var /** @type {?} */ timings = context.currentAnimateTimings = this._visitTiming(ast.timings, context);
        var /** @type {?} */ timeline = context.currentTimeline;
        if (timings.delay) {
            context.incrementTime(timings.delay);
            timeline.snapshotCurrentStyles();
        }
        var /** @type {?} */ style$$1 = ast.style;
        if (style$$1.type == 5 /* Keyframes */) {
            this.visitKeyframes(style$$1, context);
        }
        else {
            context.incrementTime(timings.duration);
            this.visitStyle(/** @type {?} */ (style$$1), context);
            timeline.applyStylesToKeyframe();
        }
        context.currentAnimateTimings = null;
        context.previousNode = ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.visitStyle = function (ast, context) {
        var /** @type {?} */ timeline = context.currentTimeline;
        var /** @type {?} */ timings = ((context.currentAnimateTimings));
        // this is a special case for when a style() call
        // directly follows  an animate() call (but not inside of an animate() call)
        if (!timings && timeline.getCurrentStyleProperties().length) {
            timeline.forwardFrame();
        }
        var /** @type {?} */ easing = (timings && timings.easing) || ast.easing;
        if (ast.isEmptyStep) {
            timeline.applyEmptyStep(easing);
        }
        else {
            timeline.setStyles(ast.styles, easing, context.errors, context.options);
        }
        context.previousNode = ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.visitKeyframes = function (ast, context) {
        var /** @type {?} */ currentAnimateTimings = ((context.currentAnimateTimings));
        var /** @type {?} */ startTime = (((context.currentTimeline))).duration;
        var /** @type {?} */ duration = currentAnimateTimings.duration;
        var /** @type {?} */ innerContext = context.createSubContext();
        var /** @type {?} */ innerTimeline = innerContext.currentTimeline;
        innerTimeline.easing = currentAnimateTimings.easing;
        ast.styles.forEach(function (step) {
            var /** @type {?} */ offset = step.offset || 0;
            innerTimeline.forwardTime(offset * duration);
            innerTimeline.setStyles(step.styles, step.easing, context.errors, context.options);
            innerTimeline.applyStylesToKeyframe();
        });
        // this will ensure that the parent timeline gets all the styles from
        // the child even if the new timeline below is not used
        context.currentTimeline.mergeTimelineCollectedStyles(innerTimeline);
        // we do this because the window between this timeline and the sub timeline
        // should ensure that the styles within are exactly the same as they were before
        context.transformIntoNewTimeline(startTime + duration);
        context.previousNode = ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.visitQuery = function (ast, context) {
        var _this = this;
        // in the event that the first step before this is a style step we need
        // to ensure the styles are applied before the children are animated
        var /** @type {?} */ startTime = context.currentTimeline.currentTime;
        var /** @type {?} */ options = ((ast.options || {}));
        var /** @type {?} */ delay = options.delay ? resolveTimingValue(options.delay) : 0;
        if (delay && (context.previousNode.type === 6 /* Style */ ||
            (startTime == 0 && context.currentTimeline.getCurrentStyleProperties().length))) {
            context.currentTimeline.snapshotCurrentStyles();
            context.previousNode = DEFAULT_NOOP_PREVIOUS_NODE;
        }
        var /** @type {?} */ furthestTime = startTime;
        var /** @type {?} */ elms = context.invokeQuery(ast.selector, ast.originalSelector, ast.limit, ast.includeSelf, options.optional ? true : false, context.errors);
        context.currentQueryTotal = elms.length;
        var /** @type {?} */ sameElementTimeline = null;
        elms.forEach(function (element, i) {
            context.currentQueryIndex = i;
            var /** @type {?} */ innerContext = context.createSubContext(ast.options, element);
            if (delay) {
                innerContext.delayNextStep(delay);
            }
            if (element === context.element) {
                sameElementTimeline = innerContext.currentTimeline;
            }
            visitDslNode(_this, ast.animation, innerContext);
            // this is here just incase the inner steps only contain or end
            // with a style() call (which is here to signal that this is a preparatory
            // call to style an element before it is animated again)
            innerContext.currentTimeline.applyStylesToKeyframe();
            var /** @type {?} */ endTime = innerContext.currentTimeline.currentTime;
            furthestTime = Math.max(furthestTime, endTime);
        });
        context.currentQueryIndex = 0;
        context.currentQueryTotal = 0;
        context.transformIntoNewTimeline(furthestTime);
        if (sameElementTimeline) {
            context.currentTimeline.mergeTimelineCollectedStyles(sameElementTimeline);
            context.currentTimeline.snapshotCurrentStyles();
        }
        context.previousNode = ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineBuilderVisitor.prototype.visitStagger = function (ast, context) {
        var /** @type {?} */ parentContext = ((context.parentContext));
        var /** @type {?} */ tl = context.currentTimeline;
        var /** @type {?} */ timings = ast.timings;
        var /** @type {?} */ duration = Math.abs(timings.duration);
        var /** @type {?} */ maxTime = duration * (context.currentQueryTotal - 1);
        var /** @type {?} */ delay = duration * context.currentQueryIndex;
        var /** @type {?} */ staggerTransformer = timings.duration < 0 ? 'reverse' : timings.easing;
        switch (staggerTransformer) {
            case 'reverse':
                delay = maxTime - delay;
                break;
            case 'full':
                delay = parentContext.currentStaggerTime;
                break;
        }
        var /** @type {?} */ timeline = context.currentTimeline;
        if (delay) {
            timeline.delayNextStep(delay);
        }
        var /** @type {?} */ startingTime = timeline.currentTime;
        visitDslNode(this, ast.animation, context);
        context.previousNode = ast;
        // time = duration + delay
        // the reason why this computation is so complex is because
        // the inner timeline may either have a delay value or a stretched
        // keyframe depending on if a subtimeline is not used or is used.
        parentContext.currentStaggerTime =
            (tl.currentTime - startingTime) + (tl.startTime - parentContext.currentTimeline.startTime);
    };
    return AnimationTimelineBuilderVisitor;
}());
var DEFAULT_NOOP_PREVIOUS_NODE = ({});
var AnimationTimelineContext = (function () {
    /**
     * @param {?} _driver
     * @param {?} element
     * @param {?} subInstructions
     * @param {?} errors
     * @param {?} timelines
     * @param {?=} initialTimeline
     */
    function AnimationTimelineContext(_driver, element, subInstructions, errors, timelines, initialTimeline) {
        this._driver = _driver;
        this.element = element;
        this.subInstructions = subInstructions;
        this.errors = errors;
        this.timelines = timelines;
        this.parentContext = null;
        this.currentAnimateTimings = null;
        this.previousNode = DEFAULT_NOOP_PREVIOUS_NODE;
        this.subContextCount = 0;
        this.options = {};
        this.currentQueryIndex = 0;
        this.currentQueryTotal = 0;
        this.currentStaggerTime = 0;
        this.currentTimeline = initialTimeline || new TimelineBuilder(element, 0);
        timelines.push(this.currentTimeline);
    }
    Object.defineProperty(AnimationTimelineContext.prototype, "params", {
        /**
         * @return {?}
         */
        get: function () { return this.options.params; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} options
     * @param {?=} skipIfExists
     * @return {?}
     */
    AnimationTimelineContext.prototype.updateOptions = function (options, skipIfExists) {
        var _this = this;
        if (!options)
            return;
        var /** @type {?} */ newOptions = (options);
        var /** @type {?} */ optionsToUpdate = this.options;
        // NOTE: this will get patched up when other animation methods support duration overrides
        if (newOptions.duration != null) {
            ((optionsToUpdate)).duration = resolveTimingValue(newOptions.duration);
        }
        if (newOptions.delay != null) {
            optionsToUpdate.delay = resolveTimingValue(newOptions.delay);
        }
        var /** @type {?} */ newParams = newOptions.params;
        if (newParams) {
            var /** @type {?} */ paramsToUpdate_1 = ((optionsToUpdate.params));
            if (!paramsToUpdate_1) {
                paramsToUpdate_1 = this.options.params = {};
            }
            Object.keys(newParams).forEach(function (name) {
                if (!skipIfExists || !paramsToUpdate_1.hasOwnProperty(name)) {
                    paramsToUpdate_1[name] = interpolateParams(newParams[name], paramsToUpdate_1, _this.errors);
                }
            });
        }
    };
    /**
     * @return {?}
     */
    AnimationTimelineContext.prototype._copyOptions = function () {
        var /** @type {?} */ options = {};
        if (this.options) {
            var /** @type {?} */ oldParams_1 = this.options.params;
            if (oldParams_1) {
                var /** @type {?} */ params_2 = options['params'] = {};
                Object.keys(oldParams_1).forEach(function (name) { params_2[name] = oldParams_1[name]; });
            }
        }
        return options;
    };
    /**
     * @param {?=} options
     * @param {?=} element
     * @param {?=} newTime
     * @return {?}
     */
    AnimationTimelineContext.prototype.createSubContext = function (options, element, newTime) {
        if (options === void 0) { options = null; }
        var /** @type {?} */ target = element || this.element;
        var /** @type {?} */ context = new AnimationTimelineContext(this._driver, target, this.subInstructions, this.errors, this.timelines, this.currentTimeline.fork(target, newTime || 0));
        context.previousNode = this.previousNode;
        context.currentAnimateTimings = this.currentAnimateTimings;
        context.options = this._copyOptions();
        context.updateOptions(options);
        context.currentQueryIndex = this.currentQueryIndex;
        context.currentQueryTotal = this.currentQueryTotal;
        context.parentContext = this;
        this.subContextCount++;
        return context;
    };
    /**
     * @param {?=} newTime
     * @return {?}
     */
    AnimationTimelineContext.prototype.transformIntoNewTimeline = function (newTime) {
        this.previousNode = DEFAULT_NOOP_PREVIOUS_NODE;
        this.currentTimeline = this.currentTimeline.fork(this.element, newTime);
        this.timelines.push(this.currentTimeline);
        return this.currentTimeline;
    };
    /**
     * @param {?} instruction
     * @param {?} duration
     * @param {?} delay
     * @return {?}
     */
    AnimationTimelineContext.prototype.appendInstructionToTimeline = function (instruction, duration, delay) {
        var /** @type {?} */ updatedTimings = {
            duration: duration != null ? duration : instruction.duration,
            delay: this.currentTimeline.currentTime + (delay != null ? delay : 0) + instruction.delay,
            easing: ''
        };
        var /** @type {?} */ builder = new SubTimelineBuilder(instruction.element, instruction.keyframes, instruction.preStyleProps, instruction.postStyleProps, updatedTimings, instruction.stretchStartingKeyframe);
        this.timelines.push(builder);
        return updatedTimings;
    };
    /**
     * @param {?} time
     * @return {?}
     */
    AnimationTimelineContext.prototype.incrementTime = function (time) {
        this.currentTimeline.forwardTime(this.currentTimeline.duration + time);
    };
    /**
     * @param {?} delay
     * @return {?}
     */
    AnimationTimelineContext.prototype.delayNextStep = function (delay) {
        // negative delays are not yet supported
        if (delay > 0) {
            this.currentTimeline.delayNextStep(delay);
        }
    };
    /**
     * @param {?} selector
     * @param {?} originalSelector
     * @param {?} limit
     * @param {?} includeSelf
     * @param {?} optional
     * @param {?} errors
     * @return {?}
     */
    AnimationTimelineContext.prototype.invokeQuery = function (selector, originalSelector, limit, includeSelf, optional, errors) {
        var /** @type {?} */ results = [];
        if (includeSelf) {
            results.push(this.element);
        }
        if (selector.length > 0) {
            var /** @type {?} */ multi = limit != 1;
            var /** @type {?} */ elements = this._driver.query(this.element, selector, multi);
            if (limit !== 0) {
                elements = elements.slice(0, limit);
            }
            results.push.apply(results, elements);
        }
        if (!optional && results.length == 0) {
            errors.push("`query(\"" + originalSelector + "\")` returned zero elements. (Use `query(\"" + originalSelector + "\", { optional: true })` if you wish to allow this.)");
        }
        return results;
    };
    return AnimationTimelineContext;
}());
var TimelineBuilder = (function () {
    /**
     * @param {?} element
     * @param {?} startTime
     * @param {?=} _elementTimelineStylesLookup
     */
    function TimelineBuilder(element, startTime, _elementTimelineStylesLookup) {
        this.element = element;
        this.startTime = startTime;
        this._elementTimelineStylesLookup = _elementTimelineStylesLookup;
        this.duration = 0;
        this._previousKeyframe = {};
        this._currentKeyframe = {};
        this._keyframes = new Map();
        this._styleSummary = {};
        this._pendingStyles = {};
        this._backFill = {};
        this._currentEmptyStepKeyframe = null;
        if (!this._elementTimelineStylesLookup) {
            this._elementTimelineStylesLookup = new Map();
        }
        this._localTimelineStyles = Object.create(this._backFill, {});
        this._globalTimelineStyles = this._elementTimelineStylesLookup.get(element);
        if (!this._globalTimelineStyles) {
            this._globalTimelineStyles = this._localTimelineStyles;
            this._elementTimelineStylesLookup.set(element, this._localTimelineStyles);
        }
        this._loadKeyframe();
    }
    /**
     * @return {?}
     */
    TimelineBuilder.prototype.containsAnimation = function () {
        switch (this._keyframes.size) {
            case 0:
                return false;
            case 1:
                return this.getCurrentStyleProperties().length > 0;
            default:
                return true;
        }
    };
    /**
     * @return {?}
     */
    TimelineBuilder.prototype.getCurrentStyleProperties = function () { return Object.keys(this._currentKeyframe); };
    Object.defineProperty(TimelineBuilder.prototype, "currentTime", {
        /**
         * @return {?}
         */
        get: function () { return this.startTime + this.duration; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} delay
     * @return {?}
     */
    TimelineBuilder.prototype.delayNextStep = function (delay) {
        // in the event that a style() step is placed right before a stagger()
        // and that style() step is the very first style() value in the animation
        // then we need to make a copy of the keyframe [0, copy, 1] so that the delay
        // properly applies the style() values to work with the stagger...
        var /** @type {?} */ hasPreStyleStep = this._keyframes.size == 1 && Object.keys(this._pendingStyles).length;
        if (this.duration || hasPreStyleStep) {
            this.forwardTime(this.currentTime + delay);
            if (hasPreStyleStep) {
                this.snapshotCurrentStyles();
            }
        }
        else {
            this.startTime += delay;
        }
    };
    /**
     * @param {?} element
     * @param {?=} currentTime
     * @return {?}
     */
    TimelineBuilder.prototype.fork = function (element, currentTime) {
        this.applyStylesToKeyframe();
        return new TimelineBuilder(element, currentTime || this.currentTime, this._elementTimelineStylesLookup);
    };
    /**
     * @return {?}
     */
    TimelineBuilder.prototype._loadKeyframe = function () {
        if (this._currentKeyframe) {
            this._previousKeyframe = this._currentKeyframe;
        }
        this._currentKeyframe = ((this._keyframes.get(this.duration)));
        if (!this._currentKeyframe) {
            this._currentKeyframe = Object.create(this._backFill, {});
            this._keyframes.set(this.duration, this._currentKeyframe);
        }
    };
    /**
     * @return {?}
     */
    TimelineBuilder.prototype.forwardFrame = function () {
        this.duration += ONE_FRAME_IN_MILLISECONDS;
        this._loadKeyframe();
    };
    /**
     * @param {?} time
     * @return {?}
     */
    TimelineBuilder.prototype.forwardTime = function (time) {
        this.applyStylesToKeyframe();
        this.duration = time;
        this._loadKeyframe();
    };
    /**
     * @param {?} prop
     * @param {?} value
     * @return {?}
     */
    TimelineBuilder.prototype._updateStyle = function (prop, value) {
        this._localTimelineStyles[prop] = value;
        this._globalTimelineStyles[prop] = value;
        this._styleSummary[prop] = { time: this.currentTime, value: value };
    };
    /**
     * @return {?}
     */
    TimelineBuilder.prototype.allowOnlyTimelineStyles = function () { return this._currentEmptyStepKeyframe !== this._currentKeyframe; };
    /**
     * @param {?} easing
     * @return {?}
     */
    TimelineBuilder.prototype.applyEmptyStep = function (easing) {
        var _this = this;
        if (easing) {
            this._previousKeyframe['easing'] = easing;
        }
        // special case for animate(duration):
        // all missing styles are filled with a `*` value then
        // if any destination styles are filled in later on the same
        // keyframe then they will override the overridden styles
        // We use `_globalTimelineStyles` here because there may be
        // styles in previous keyframes that are not present in this timeline
        Object.keys(this._globalTimelineStyles).forEach(function (prop) {
            _this._backFill[prop] = _this._globalTimelineStyles[prop] || __WEBPACK_IMPORTED_MODULE_1__angular_animations__["AUTO_STYLE"];
            _this._currentKeyframe[prop] = __WEBPACK_IMPORTED_MODULE_1__angular_animations__["AUTO_STYLE"];
        });
        this._currentEmptyStepKeyframe = this._currentKeyframe;
    };
    /**
     * @param {?} input
     * @param {?} easing
     * @param {?} errors
     * @param {?=} options
     * @return {?}
     */
    TimelineBuilder.prototype.setStyles = function (input, easing, errors, options) {
        var _this = this;
        if (easing) {
            this._previousKeyframe['easing'] = easing;
        }
        var /** @type {?} */ params = (options && options.params) || {};
        var /** @type {?} */ styles = flattenStyles(input, this._globalTimelineStyles);
        Object.keys(styles).forEach(function (prop) {
            var /** @type {?} */ val = interpolateParams(styles[prop], params, errors);
            _this._pendingStyles[prop] = val;
            if (!_this._localTimelineStyles.hasOwnProperty(prop)) {
                _this._backFill[prop] = _this._globalTimelineStyles.hasOwnProperty(prop) ?
                    _this._globalTimelineStyles[prop] :
                    __WEBPACK_IMPORTED_MODULE_1__angular_animations__["AUTO_STYLE"];
            }
            _this._updateStyle(prop, val);
        });
    };
    /**
     * @return {?}
     */
    TimelineBuilder.prototype.applyStylesToKeyframe = function () {
        var _this = this;
        var /** @type {?} */ styles = this._pendingStyles;
        var /** @type {?} */ props = Object.keys(styles);
        if (props.length == 0)
            return;
        this._pendingStyles = {};
        props.forEach(function (prop) {
            var /** @type {?} */ val = styles[prop];
            _this._currentKeyframe[prop] = val;
        });
        Object.keys(this._localTimelineStyles).forEach(function (prop) {
            if (!_this._currentKeyframe.hasOwnProperty(prop)) {
                _this._currentKeyframe[prop] = _this._localTimelineStyles[prop];
            }
        });
    };
    /**
     * @return {?}
     */
    TimelineBuilder.prototype.snapshotCurrentStyles = function () {
        var _this = this;
        Object.keys(this._localTimelineStyles).forEach(function (prop) {
            var /** @type {?} */ val = _this._localTimelineStyles[prop];
            _this._pendingStyles[prop] = val;
            _this._updateStyle(prop, val);
        });
    };
    /**
     * @return {?}
     */
    TimelineBuilder.prototype.getFinalKeyframe = function () { return this._keyframes.get(this.duration); };
    Object.defineProperty(TimelineBuilder.prototype, "properties", {
        /**
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ properties = [];
            for (var /** @type {?} */ prop in this._currentKeyframe) {
                properties.push(prop);
            }
            return properties;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} timeline
     * @return {?}
     */
    TimelineBuilder.prototype.mergeTimelineCollectedStyles = function (timeline) {
        var _this = this;
        Object.keys(timeline._styleSummary).forEach(function (prop) {
            var /** @type {?} */ details0 = _this._styleSummary[prop];
            var /** @type {?} */ details1 = timeline._styleSummary[prop];
            if (!details0 || details1.time > details0.time) {
                _this._updateStyle(prop, details1.value);
            }
        });
    };
    /**
     * @return {?}
     */
    TimelineBuilder.prototype.buildKeyframes = function () {
        var _this = this;
        this.applyStylesToKeyframe();
        var /** @type {?} */ preStyleProps = new Set();
        var /** @type {?} */ postStyleProps = new Set();
        var /** @type {?} */ isEmpty = this._keyframes.size === 1 && this.duration === 0;
        var /** @type {?} */ finalKeyframes = [];
        this._keyframes.forEach(function (keyframe, time) {
            var /** @type {?} */ finalKeyframe = copyStyles(keyframe, true);
            Object.keys(finalKeyframe).forEach(function (prop) {
                var /** @type {?} */ value = finalKeyframe[prop];
                if (value == __WEBPACK_IMPORTED_MODULE_1__angular_animations__["ɵPRE_STYLE"]) {
                    preStyleProps.add(prop);
                }
                else if (value == __WEBPACK_IMPORTED_MODULE_1__angular_animations__["AUTO_STYLE"]) {
                    postStyleProps.add(prop);
                }
            });
            if (!isEmpty) {
                finalKeyframe['offset'] = time / _this.duration;
            }
            finalKeyframes.push(finalKeyframe);
        });
        var /** @type {?} */ preProps = preStyleProps.size ? iteratorToArray(preStyleProps.values()) : [];
        var /** @type {?} */ postProps = postStyleProps.size ? iteratorToArray(postStyleProps.values()) : [];
        // special case for a 0-second animation (which is designed just to place styles onscreen)
        if (isEmpty) {
            var /** @type {?} */ kf0 = finalKeyframes[0];
            var /** @type {?} */ kf1 = copyObj(kf0);
            kf0['offset'] = 0;
            kf1['offset'] = 1;
            finalKeyframes = [kf0, kf1];
        }
        return createTimelineInstruction(this.element, finalKeyframes, preProps, postProps, this.duration, this.startTime, this.easing, false);
    };
    return TimelineBuilder;
}());
var SubTimelineBuilder = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["__extends"](SubTimelineBuilder, _super);
    /**
     * @param {?} element
     * @param {?} keyframes
     * @param {?} preStyleProps
     * @param {?} postStyleProps
     * @param {?} timings
     * @param {?=} _stretchStartingKeyframe
     */
    function SubTimelineBuilder(element, keyframes, preStyleProps, postStyleProps, timings, _stretchStartingKeyframe) {
        if (_stretchStartingKeyframe === void 0) { _stretchStartingKeyframe = false; }
        var _this = _super.call(this, element, timings.delay) || this;
        _this.element = element;
        _this.keyframes = keyframes;
        _this.preStyleProps = preStyleProps;
        _this.postStyleProps = postStyleProps;
        _this._stretchStartingKeyframe = _stretchStartingKeyframe;
        _this.timings = { duration: timings.duration, delay: timings.delay, easing: timings.easing };
        return _this;
    }
    /**
     * @return {?}
     */
    SubTimelineBuilder.prototype.containsAnimation = function () { return this.keyframes.length > 1; };
    /**
     * @return {?}
     */
    SubTimelineBuilder.prototype.buildKeyframes = function () {
        var /** @type {?} */ keyframes = this.keyframes;
        var _a = this.timings, delay = _a.delay, duration = _a.duration, easing = _a.easing;
        if (this._stretchStartingKeyframe && delay) {
            var /** @type {?} */ newKeyframes = [];
            var /** @type {?} */ totalTime = duration + delay;
            var /** @type {?} */ startingGap = delay / totalTime;
            // the original starting keyframe now starts once the delay is done
            var /** @type {?} */ newFirstKeyframe = copyStyles(keyframes[0], false);
            newFirstKeyframe['offset'] = 0;
            newKeyframes.push(newFirstKeyframe);
            var /** @type {?} */ oldFirstKeyframe = copyStyles(keyframes[0], false);
            oldFirstKeyframe['offset'] = roundOffset(startingGap);
            newKeyframes.push(oldFirstKeyframe);
            /*
              When the keyframe is stretched then it means that the delay before the animation
              starts is gone. Instead the first keyframe is placed at the start of the animation
              and it is then copied to where it starts when the original delay is over. This basically
              means nothing animates during that delay, but the styles are still renderered. For this
              to work the original offset values that exist in the original keyframes must be "warped"
              so that they can take the new keyframe + delay into account.
      
              delay=1000, duration=1000, keyframes = 0 .5 1
      
              turns into
      
              delay=0, duration=2000, keyframes = 0 .33 .66 1
             */
            // offsets between 1 ... n -1 are all warped by the keyframe stretch
            var /** @type {?} */ limit = keyframes.length - 1;
            for (var /** @type {?} */ i = 1; i <= limit; i++) {
                var /** @type {?} */ kf = copyStyles(keyframes[i], false);
                var /** @type {?} */ oldOffset = (kf['offset']);
                var /** @type {?} */ timeAtKeyframe = delay + oldOffset * duration;
                kf['offset'] = roundOffset(timeAtKeyframe / totalTime);
                newKeyframes.push(kf);
            }
            // the new starting keyframe should be added at the start
            duration = totalTime;
            delay = 0;
            easing = '';
            keyframes = newKeyframes;
        }
        return createTimelineInstruction(this.element, keyframes, this.preStyleProps, this.postStyleProps, duration, delay, easing, true);
    };
    return SubTimelineBuilder;
}(TimelineBuilder));
/**
 * @param {?} offset
 * @param {?=} decimalPoints
 * @return {?}
 */
function roundOffset(offset, decimalPoints) {
    if (decimalPoints === void 0) { decimalPoints = 3; }
    var /** @type {?} */ mult = Math.pow(10, decimalPoints - 1);
    return Math.round(offset * mult) / mult;
}
/**
 * @param {?} input
 * @param {?} allStyles
 * @return {?}
 */
function flattenStyles(input, allStyles) {
    var /** @type {?} */ styles = {};
    var /** @type {?} */ allProperties;
    input.forEach(function (token) {
        if (token === '*') {
            allProperties = allProperties || Object.keys(allStyles);
            allProperties.forEach(function (prop) { styles[prop] = __WEBPACK_IMPORTED_MODULE_1__angular_animations__["AUTO_STYLE"]; });
        }
        else {
            copyStyles(/** @type {?} */ (token), false, styles);
        }
    });
    return styles;
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var Animation = (function () {
    /**
     * @param {?} _driver
     * @param {?} input
     */
    function Animation(_driver, input) {
        this._driver = _driver;
        var errors = [];
        var ast = buildAnimationAst(input, errors);
        if (errors.length) {
            var errorMessage = "animation validation failed:\n" + errors.join("\n");
            throw new Error(errorMessage);
        }
        this._animationAst = ast;
    }
    /**
     * @param {?} element
     * @param {?} startingStyles
     * @param {?} destinationStyles
     * @param {?} options
     * @param {?=} subInstructions
     * @return {?}
     */
    Animation.prototype.buildTimelines = function (element, startingStyles, destinationStyles, options, subInstructions) {
        var /** @type {?} */ start = Array.isArray(startingStyles) ? normalizeStyles(startingStyles) : (startingStyles);
        var /** @type {?} */ dest = Array.isArray(destinationStyles) ? normalizeStyles(destinationStyles) : (destinationStyles);
        var /** @type {?} */ errors = [];
        subInstructions = subInstructions || new ElementInstructionMap();
        var /** @type {?} */ result = buildAnimationTimelines(this._driver, element, this._animationAst, start, dest, options, subInstructions, errors);
        if (errors.length) {
            var /** @type {?} */ errorMessage = "animation building failed:\n" + errors.join("\n");
            throw new Error(errorMessage);
        }
        return result;
    };
    return Animation;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @experimental Animation support is experimental.
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */ var AnimationStyleNormalizer = (function () {
    function AnimationStyleNormalizer() {
    }
    return AnimationStyleNormalizer;
}());
/**
 * @experimental Animation support is experimental.
 */
var NoopAnimationStyleNormalizer = (function () {
    function NoopAnimationStyleNormalizer() {
    }
    NoopAnimationStyleNormalizer.prototype.normalizePropertyName = function (propertyName, errors) { return propertyName; };
    NoopAnimationStyleNormalizer.prototype.normalizeStyleValue = function (userProvidedProperty, normalizedProperty, value, errors) {
        return value;
    };
    return NoopAnimationStyleNormalizer;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var WebAnimationsStyleNormalizer = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["__extends"](WebAnimationsStyleNormalizer, _super);
    function WebAnimationsStyleNormalizer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} propertyName
     * @param {?} errors
     * @return {?}
     */
    WebAnimationsStyleNormalizer.prototype.normalizePropertyName = function (propertyName, errors) {
        return dashCaseToCamelCase(propertyName);
    };
    /**
     * @param {?} userProvidedProperty
     * @param {?} normalizedProperty
     * @param {?} value
     * @param {?} errors
     * @return {?}
     */
    WebAnimationsStyleNormalizer.prototype.normalizeStyleValue = function (userProvidedProperty, normalizedProperty, value, errors) {
        var /** @type {?} */ unit = '';
        var /** @type {?} */ strVal = value.toString().trim();
        if (DIMENSIONAL_PROP_MAP[normalizedProperty] && value !== 0 && value !== '0') {
            if (typeof value === 'number') {
                unit = 'px';
            }
            else {
                var /** @type {?} */ valAndSuffixMatch = value.match(/^[+-]?[\d\.]+([a-z]*)$/);
                if (valAndSuffixMatch && valAndSuffixMatch[1].length == 0) {
                    errors.push("Please provide a CSS unit value for " + userProvidedProperty + ":" + value);
                }
            }
        }
        return strVal + unit;
    };
    return WebAnimationsStyleNormalizer;
}(AnimationStyleNormalizer));
var DIMENSIONAL_PROP_MAP = makeBooleanMap('width,height,minWidth,minHeight,maxWidth,maxHeight,left,top,bottom,right,fontSize,outlineWidth,outlineOffset,paddingTop,paddingLeft,paddingBottom,paddingRight,marginTop,marginLeft,marginBottom,marginRight,borderRadius,borderWidth,borderTopWidth,borderLeftWidth,borderRightWidth,borderBottomWidth,textIndent,perspective'
    .split(','));
/**
 * @param {?} keys
 * @return {?}
 */
function makeBooleanMap(keys) {
    var /** @type {?} */ map = {};
    keys.forEach(function (key) { return map[key] = true; });
    return map;
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @param {?} element
 * @param {?} triggerName
 * @param {?} fromState
 * @param {?} toState
 * @param {?} isRemovalTransition
 * @param {?} fromStyles
 * @param {?} toStyles
 * @param {?} timelines
 * @param {?} queriedElements
 * @param {?} preStyleProps
 * @param {?} postStyleProps
 * @param {?=} errors
 * @return {?}
 */
function createTransitionInstruction(element, triggerName, fromState, toState, isRemovalTransition, fromStyles, toStyles, timelines, queriedElements, preStyleProps, postStyleProps, errors) {
    return {
        type: 0 /* TransitionAnimation */,
        element: element,
        triggerName: triggerName,
        isRemovalTransition: isRemovalTransition,
        fromState: fromState,
        fromStyles: fromStyles,
        toState: toState,
        toStyles: toStyles,
        timelines: timelines,
        queriedElements: queriedElements,
        preStyleProps: preStyleProps,
        postStyleProps: postStyleProps,
        errors: errors
    };
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var EMPTY_OBJECT = {};
var AnimationTransitionFactory = (function () {
    /**
     * @param {?} _triggerName
     * @param {?} ast
     * @param {?} _stateStyles
     */
    function AnimationTransitionFactory(_triggerName, ast, _stateStyles) {
        this._triggerName = _triggerName;
        this.ast = ast;
        this._stateStyles = _stateStyles;
    }
    /**
     * @param {?} currentState
     * @param {?} nextState
     * @return {?}
     */
    AnimationTransitionFactory.prototype.match = function (currentState, nextState) {
        return oneOrMoreTransitionsMatch(this.ast.matchers, currentState, nextState);
    };
    /**
     * @param {?} stateName
     * @param {?} params
     * @param {?} errors
     * @return {?}
     */
    AnimationTransitionFactory.prototype.buildStyles = function (stateName, params, errors) {
        var /** @type {?} */ backupStateStyler = this._stateStyles['*'];
        var /** @type {?} */ stateStyler = this._stateStyles[stateName];
        var /** @type {?} */ backupStyles = backupStateStyler ? backupStateStyler.buildStyles(params, errors) : {};
        return stateStyler ? stateStyler.buildStyles(params, errors) : backupStyles;
    };
    /**
     * @param {?} driver
     * @param {?} element
     * @param {?} currentState
     * @param {?} nextState
     * @param {?=} currentOptions
     * @param {?=} nextOptions
     * @param {?=} subInstructions
     * @return {?}
     */
    AnimationTransitionFactory.prototype.build = function (driver, element, currentState, nextState, currentOptions, nextOptions, subInstructions) {
        var /** @type {?} */ errors = [];
        var /** @type {?} */ transitionAnimationParams = this.ast.options && this.ast.options.params || EMPTY_OBJECT;
        var /** @type {?} */ currentAnimationParams = currentOptions && currentOptions.params || EMPTY_OBJECT;
        var /** @type {?} */ currentStateStyles = this.buildStyles(currentState, currentAnimationParams, errors);
        var /** @type {?} */ nextAnimationParams = nextOptions && nextOptions.params || EMPTY_OBJECT;
        var /** @type {?} */ nextStateStyles = this.buildStyles(nextState, nextAnimationParams, errors);
        var /** @type {?} */ queriedElements = new Set();
        var /** @type {?} */ preStyleMap = new Map();
        var /** @type {?} */ postStyleMap = new Map();
        var /** @type {?} */ isRemoval = nextState === 'void';
        var /** @type {?} */ animationOptions = { params: Object.assign({}, transitionAnimationParams, nextAnimationParams) };
        var /** @type {?} */ timelines = buildAnimationTimelines(driver, element, this.ast.animation, currentStateStyles, nextStateStyles, animationOptions, subInstructions, errors);
        if (errors.length) {
            return createTransitionInstruction(element, this._triggerName, currentState, nextState, isRemoval, currentStateStyles, nextStateStyles, [], [], preStyleMap, postStyleMap, errors);
        }
        timelines.forEach(function (tl) {
            var /** @type {?} */ elm = tl.element;
            var /** @type {?} */ preProps = getOrSetAsInMap(preStyleMap, elm, {});
            tl.preStyleProps.forEach(function (prop) { return preProps[prop] = true; });
            var /** @type {?} */ postProps = getOrSetAsInMap(postStyleMap, elm, {});
            tl.postStyleProps.forEach(function (prop) { return postProps[prop] = true; });
            if (elm !== element) {
                queriedElements.add(elm);
            }
        });
        var /** @type {?} */ queriedElementsList = iteratorToArray(queriedElements.values());
        return createTransitionInstruction(element, this._triggerName, currentState, nextState, isRemoval, currentStateStyles, nextStateStyles, timelines, queriedElementsList, preStyleMap, postStyleMap);
    };
    return AnimationTransitionFactory;
}());
/**
 * @param {?} matchFns
 * @param {?} currentState
 * @param {?} nextState
 * @return {?}
 */
function oneOrMoreTransitionsMatch(matchFns, currentState, nextState) {
    return matchFns.some(function (fn) { return fn(currentState, nextState); });
}
var AnimationStateStyles = (function () {
    /**
     * @param {?} styles
     * @param {?} defaultParams
     */
    function AnimationStateStyles(styles, defaultParams) {
        this.styles = styles;
        this.defaultParams = defaultParams;
    }
    /**
     * @param {?} params
     * @param {?} errors
     * @return {?}
     */
    AnimationStateStyles.prototype.buildStyles = function (params, errors) {
        var /** @type {?} */ finalStyles = {};
        var /** @type {?} */ combinedParams = copyObj(this.defaultParams);
        Object.keys(params).forEach(function (key) {
            var /** @type {?} */ value = params[key];
            if (value != null) {
                combinedParams[key] = value;
            }
        });
        this.styles.styles.forEach(function (value) {
            if (typeof value !== 'string') {
                var /** @type {?} */ styleObj_1 = (value);
                Object.keys(styleObj_1).forEach(function (prop) {
                    var /** @type {?} */ val = styleObj_1[prop];
                    if (val.length > 1) {
                        val = interpolateParams(val, combinedParams, errors);
                    }
                    finalStyles[prop] = val;
                });
            }
        });
        return finalStyles;
    };
    return AnimationStateStyles;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * \@experimental Animation support is experimental.
 * @param {?} name
 * @param {?} ast
 * @return {?}
 */
function buildTrigger(name, ast) {
    return new AnimationTrigger(name, ast);
}
/**
 * \@experimental Animation support is experimental.
 */
var AnimationTrigger = (function () {
    /**
     * @param {?} name
     * @param {?} ast
     */
    function AnimationTrigger(name, ast) {
        var _this = this;
        this.name = name;
        this.ast = ast;
        this.transitionFactories = [];
        this.states = {};
        ast.states.forEach(function (ast) {
            var defaultParams = (ast.options && ast.options.params) || {};
            _this.states[ast.name] = new AnimationStateStyles(ast.style, defaultParams);
        });
        balanceProperties(this.states, 'true', '1');
        balanceProperties(this.states, 'false', '0');
        ast.transitions.forEach(function (ast) {
            _this.transitionFactories.push(new AnimationTransitionFactory(name, ast, _this.states));
        });
        this.fallbackTransition = createFallbackTransition(name, this.states);
    }
    Object.defineProperty(AnimationTrigger.prototype, "containsQueries", {
        /**
         * @return {?}
         */
        get: function () { return this.ast.queryCount > 0; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} currentState
     * @param {?} nextState
     * @return {?}
     */
    AnimationTrigger.prototype.matchTransition = function (currentState, nextState) {
        var /** @type {?} */ entry = this.transitionFactories.find(function (f) { return f.match(currentState, nextState); });
        return entry || null;
    };
    /**
     * @param {?} currentState
     * @param {?} params
     * @param {?} errors
     * @return {?}
     */
    AnimationTrigger.prototype.matchStyles = function (currentState, params, errors) {
        return this.fallbackTransition.buildStyles(currentState, params, errors);
    };
    return AnimationTrigger;
}());
/**
 * @param {?} triggerName
 * @param {?} states
 * @return {?}
 */
function createFallbackTransition(triggerName, states) {
    var /** @type {?} */ matchers = [function (fromState, toState) { return true; }];
    var /** @type {?} */ animation = { type: 2 /* Sequence */, steps: [], options: null };
    var /** @type {?} */ transition = {
        type: 1 /* Transition */,
        animation: animation,
        matchers: matchers,
        options: null,
        queryCount: 0,
        depCount: 0
    };
    return new AnimationTransitionFactory(triggerName, transition, states);
}
/**
 * @param {?} obj
 * @param {?} key1
 * @param {?} key2
 * @return {?}
 */
function balanceProperties(obj, key1, key2) {
    if (obj.hasOwnProperty(key1)) {
        if (!obj.hasOwnProperty(key2)) {
            obj[key2] = obj[key1];
        }
    }
    else if (obj.hasOwnProperty(key2)) {
        obj[key1] = obj[key2];
    }
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var EMPTY_INSTRUCTION_MAP = new ElementInstructionMap();
var TimelineAnimationEngine = (function () {
    /**
     * @param {?} _driver
     * @param {?} _normalizer
     */
    function TimelineAnimationEngine(_driver, _normalizer) {
        this._driver = _driver;
        this._normalizer = _normalizer;
        this._animations = {};
        this._playersById = {};
        this.players = [];
    }
    /**
     * @param {?} id
     * @param {?} metadata
     * @return {?}
     */
    TimelineAnimationEngine.prototype.register = function (id, metadata) {
        var /** @type {?} */ errors = [];
        var /** @type {?} */ ast = buildAnimationAst(metadata, errors);
        if (errors.length) {
            throw new Error("Unable to build the animation due to the following errors: " + errors.join("\n"));
        }
        else {
            this._animations[id] = ast;
        }
    };
    /**
     * @param {?} i
     * @param {?} preStyles
     * @param {?=} postStyles
     * @return {?}
     */
    TimelineAnimationEngine.prototype._buildPlayer = function (i, preStyles, postStyles) {
        var /** @type {?} */ element = i.element;
        var /** @type {?} */ keyframes = normalizeKeyframes(this._driver, this._normalizer, element, i.keyframes, preStyles, postStyles);
        return this._driver.animate(element, keyframes, i.duration, i.delay, i.easing, []);
    };
    /**
     * @param {?} id
     * @param {?} element
     * @param {?=} options
     * @return {?}
     */
    TimelineAnimationEngine.prototype.create = function (id, element, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var /** @type {?} */ errors = [];
        var /** @type {?} */ ast = this._animations[id];
        var /** @type {?} */ instructions;
        var /** @type {?} */ autoStylesMap = new Map();
        if (ast) {
            instructions = buildAnimationTimelines(this._driver, element, ast, {}, {}, options, EMPTY_INSTRUCTION_MAP, errors);
            instructions.forEach(function (inst) {
                var /** @type {?} */ styles = getOrSetAsInMap(autoStylesMap, inst.element, {});
                inst.postStyleProps.forEach(function (prop) { return styles[prop] = null; });
            });
        }
        else {
            errors.push('The requested animation doesn\'t exist or has already been destroyed');
            instructions = [];
        }
        if (errors.length) {
            throw new Error("Unable to create the animation due to the following errors: " + errors.join("\n"));
        }
        autoStylesMap.forEach(function (styles, element) {
            Object.keys(styles).forEach(function (prop) { styles[prop] = _this._driver.computeStyle(element, prop, __WEBPACK_IMPORTED_MODULE_1__angular_animations__["AUTO_STYLE"]); });
        });
        var /** @type {?} */ players = instructions.map(function (i) {
            var /** @type {?} */ styles = autoStylesMap.get(i.element);
            return _this._buildPlayer(i, {}, styles);
        });
        var /** @type {?} */ player = optimizeGroupPlayer(players);
        this._playersById[id] = player;
        player.onDestroy(function () { return _this.destroy(id); });
        this.players.push(player);
        return player;
    };
    /**
     * @param {?} id
     * @return {?}
     */
    TimelineAnimationEngine.prototype.destroy = function (id) {
        var /** @type {?} */ player = this._getPlayer(id);
        player.destroy();
        delete this._playersById[id];
        var /** @type {?} */ index = this.players.indexOf(player);
        if (index >= 0) {
            this.players.splice(index, 1);
        }
    };
    /**
     * @param {?} id
     * @return {?}
     */
    TimelineAnimationEngine.prototype._getPlayer = function (id) {
        var /** @type {?} */ player = this._playersById[id];
        if (!player) {
            throw new Error("Unable to find the timeline player referenced by " + id);
        }
        return player;
    };
    /**
     * @param {?} id
     * @param {?} element
     * @param {?} eventName
     * @param {?} callback
     * @return {?}
     */
    TimelineAnimationEngine.prototype.listen = function (id, element, eventName, callback) {
        // triggerName, fromState, toState are all ignored for timeline animations
        var /** @type {?} */ baseEvent = makeAnimationEvent(element, '', '', '');
        listenOnPlayer(this._getPlayer(id), eventName, baseEvent, callback);
        return function () { };
    };
    /**
     * @param {?} id
     * @param {?} element
     * @param {?} command
     * @param {?} args
     * @return {?}
     */
    TimelineAnimationEngine.prototype.command = function (id, element, command, args) {
        if (command == 'register') {
            this.register(id, /** @type {?} */ (args[0]));
            return;
        }
        if (command == 'create') {
            var /** @type {?} */ options = ((args[0] || {}));
            this.create(id, element, options);
            return;
        }
        var /** @type {?} */ player = this._getPlayer(id);
        switch (command) {
            case 'play':
                player.play();
                break;
            case 'pause':
                player.pause();
                break;
            case 'reset':
                player.reset();
                break;
            case 'restart':
                player.restart();
                break;
            case 'finish':
                player.finish();
                break;
            case 'init':
                player.init();
                break;
            case 'setPosition':
                player.setPosition(parseFloat(/** @type {?} */ (args[0])));
                break;
            case 'destroy':
                this.destroy(id);
                break;
        }
    };
    return TimelineAnimationEngine;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var QUEUED_CLASSNAME = 'ng-animate-queued';
var QUEUED_SELECTOR = '.ng-animate-queued';
var DISABLED_CLASSNAME = 'ng-animate-disabled';
var DISABLED_SELECTOR = '.ng-animate-disabled';
var EMPTY_PLAYER_ARRAY = [];
var NULL_REMOVAL_STATE = {
    namespaceId: '',
    setForRemoval: null,
    hasAnimation: false,
    removedBeforeQueried: false
};
var NULL_REMOVED_QUERIED_STATE = {
    namespaceId: '',
    setForRemoval: null,
    hasAnimation: false,
    removedBeforeQueried: true
};
var REMOVAL_FLAG = '__ng_removed';
var StateValue = (function () {
    /**
     * @param {?} input
     */
    function StateValue(input) {
        var isObj = input && input.hasOwnProperty('value');
        var value = isObj ? input['value'] : input;
        this.value = normalizeTriggerValue(value);
        if (isObj) {
            var options = copyObj(input);
            delete options['value'];
            this.options = options;
        }
        else {
            this.options = {};
        }
        if (!this.options.params) {
            this.options.params = {};
        }
    }
    Object.defineProperty(StateValue.prototype, "params", {
        /**
         * @return {?}
         */
        get: function () { return (this.options.params); },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} options
     * @return {?}
     */
    StateValue.prototype.absorbOptions = function (options) {
        var /** @type {?} */ newParams = options.params;
        if (newParams) {
            var /** @type {?} */ oldParams_2 = ((this.options.params));
            Object.keys(newParams).forEach(function (prop) {
                if (oldParams_2[prop] == null) {
                    oldParams_2[prop] = newParams[prop];
                }
            });
        }
    };
    return StateValue;
}());
var VOID_VALUE = 'void';
var DEFAULT_STATE_VALUE = new StateValue(VOID_VALUE);
var DELETED_STATE_VALUE = new StateValue('DELETED');
var AnimationTransitionNamespace = (function () {
    /**
     * @param {?} id
     * @param {?} hostElement
     * @param {?} _engine
     */
    function AnimationTransitionNamespace(id, hostElement, _engine) {
        this.id = id;
        this.hostElement = hostElement;
        this._engine = _engine;
        this.players = [];
        this._triggers = {};
        this._queue = [];
        this._elementListeners = new Map();
        this._hostClassName = 'ng-tns-' + id;
        addClass(hostElement, this._hostClassName);
    }
    /**
     * @param {?} element
     * @param {?} name
     * @param {?} phase
     * @param {?} callback
     * @return {?}
     */
    AnimationTransitionNamespace.prototype.listen = function (element, name, phase, callback) {
        var _this = this;
        if (!this._triggers.hasOwnProperty(name)) {
            throw new Error("Unable to listen on the animation trigger event \"" + phase + "\" because the animation trigger \"" + name + "\" doesn't exist!");
        }
        if (phase == null || phase.length == 0) {
            throw new Error("Unable to listen on the animation trigger \"" + name + "\" because the provided event is undefined!");
        }
        if (!isTriggerEventValid(phase)) {
            throw new Error("The provided animation trigger event \"" + phase + "\" for the animation trigger \"" + name + "\" is not supported!");
        }
        var /** @type {?} */ listeners = getOrSetAsInMap(this._elementListeners, element, []);
        var /** @type {?} */ data = { name: name, phase: phase, callback: callback };
        listeners.push(data);
        var /** @type {?} */ triggersWithStates = getOrSetAsInMap(this._engine.statesByElement, element, {});
        if (!triggersWithStates.hasOwnProperty(name)) {
            addClass(element, NG_TRIGGER_CLASSNAME);
            addClass(element, NG_TRIGGER_CLASSNAME + '-' + name);
            triggersWithStates[name] = null;
        }
        return function () {
            // the event listener is removed AFTER the flush has occurred such
            // that leave animations callbacks can fire (otherwise if the node
            // is removed in between then the listeners would be deregistered)
            _this._engine.afterFlush(function () {
                var /** @type {?} */ index = listeners.indexOf(data);
                if (index >= 0) {
                    listeners.splice(index, 1);
                }
                if (!_this._triggers[name]) {
                    delete triggersWithStates[name];
                }
            });
        };
    };
    /**
     * @param {?} name
     * @param {?} ast
     * @return {?}
     */
    AnimationTransitionNamespace.prototype.register = function (name, ast) {
        if (this._triggers[name]) {
            // throw
            return false;
        }
        else {
            this._triggers[name] = ast;
            return true;
        }
    };
    /**
     * @param {?} name
     * @return {?}
     */
    AnimationTransitionNamespace.prototype._getTrigger = function (name) {
        var /** @type {?} */ trigger = this._triggers[name];
        if (!trigger) {
            throw new Error("The provided animation trigger \"" + name + "\" has not been registered!");
        }
        return trigger;
    };
    /**
     * @param {?} element
     * @param {?} triggerName
     * @param {?} value
     * @param {?=} defaultToFallback
     * @return {?}
     */
    AnimationTransitionNamespace.prototype.trigger = function (element, triggerName, value, defaultToFallback) {
        var _this = this;
        if (defaultToFallback === void 0) { defaultToFallback = true; }
        var /** @type {?} */ trigger = this._getTrigger(triggerName);
        var /** @type {?} */ player = new TransitionAnimationPlayer(this.id, triggerName, element);
        var /** @type {?} */ triggersWithStates = this._engine.statesByElement.get(element);
        if (!triggersWithStates) {
            addClass(element, NG_TRIGGER_CLASSNAME);
            addClass(element, NG_TRIGGER_CLASSNAME + '-' + triggerName);
            this._engine.statesByElement.set(element, triggersWithStates = {});
        }
        var /** @type {?} */ fromState = triggersWithStates[triggerName];
        var /** @type {?} */ toState = new StateValue(value);
        var /** @type {?} */ isObj = value && value.hasOwnProperty('value');
        if (!isObj && fromState) {
            toState.absorbOptions(fromState.options);
        }
        triggersWithStates[triggerName] = toState;
        if (!fromState) {
            fromState = DEFAULT_STATE_VALUE;
        }
        else if (fromState === DELETED_STATE_VALUE) {
            return player;
        }
        var /** @type {?} */ isRemoval = toState.value === VOID_VALUE;
        // normally this isn't reached by here, however, if an object expression
        // is passed in then it may be a new object each time. Comparing the value
        // is important since that will stay the same despite there being a new object.
        // The removal arc here is special cased because the same element is triggered
        // twice in the event that it contains animations on the outer/inner portions
        // of the host container
        if (!isRemoval && fromState.value === toState.value) {
            // this means that despite the value not changing, some inner params
            // have changed which means that the animation final styles need to be applied
            if (!objEquals(fromState.params, toState.params)) {
                var /** @type {?} */ errors = [];
                var /** @type {?} */ fromStyles_1 = trigger.matchStyles(fromState.value, fromState.params, errors);
                var /** @type {?} */ toStyles_1 = trigger.matchStyles(toState.value, toState.params, errors);
                if (errors.length) {
                    this._engine.reportError(errors);
                }
                else {
                    this._engine.afterFlush(function () {
                        eraseStyles(element, fromStyles_1);
                        setStyles(element, toStyles_1);
                    });
                }
            }
            return;
        }
        var /** @type {?} */ playersOnElement = getOrSetAsInMap(this._engine.playersByElement, element, []);
        playersOnElement.forEach(function (player) {
            // only remove the player if it is queued on the EXACT same trigger/namespace
            // we only also deal with queued players here because if the animation has
            // started then we want to keep the player alive until the flush happens
            // (which is where the previousPlayers are passed into the new palyer)
            if (player.namespaceId == _this.id && player.triggerName == triggerName && player.queued) {
                player.destroy();
            }
        });
        var /** @type {?} */ transition = trigger.matchTransition(fromState.value, toState.value);
        var /** @type {?} */ isFallbackTransition = false;
        if (!transition) {
            if (!defaultToFallback)
                return;
            transition = trigger.fallbackTransition;
            isFallbackTransition = true;
        }
        this._engine.totalQueuedPlayers++;
        this._queue.push({ element: element, triggerName: triggerName, transition: transition, fromState: fromState, toState: toState, player: player, isFallbackTransition: isFallbackTransition });
        if (!isFallbackTransition) {
            addClass(element, QUEUED_CLASSNAME);
            player.onStart(function () { removeClass(element, QUEUED_CLASSNAME); });
        }
        player.onDone(function () {
            var /** @type {?} */ index = _this.players.indexOf(player);
            if (index >= 0) {
                _this.players.splice(index, 1);
            }
            var /** @type {?} */ players = _this._engine.playersByElement.get(element);
            if (players) {
                var /** @type {?} */ index_1 = players.indexOf(player);
                if (index_1 >= 0) {
                    players.splice(index_1, 1);
                }
            }
        });
        this.players.push(player);
        playersOnElement.push(player);
        return player;
    };
    /**
     * @param {?} name
     * @return {?}
     */
    AnimationTransitionNamespace.prototype.deregister = function (name) {
        var _this = this;
        delete this._triggers[name];
        this._engine.statesByElement.forEach(function (stateMap, element) { delete stateMap[name]; });
        this._elementListeners.forEach(function (listeners, element) {
            _this._elementListeners.set(element, listeners.filter(function (entry) { return entry.name != name; }));
        });
    };
    /**
     * @param {?} element
     * @return {?}
     */
    AnimationTransitionNamespace.prototype.clearElementCache = function (element) {
        this._engine.statesByElement.delete(element);
        this._elementListeners.delete(element);
        var /** @type {?} */ elementPlayers = this._engine.playersByElement.get(element);
        if (elementPlayers) {
            elementPlayers.forEach(function (player) { return player.destroy(); });
            this._engine.playersByElement.delete(element);
        }
    };
    /**
     * @param {?} rootElement
     * @param {?} context
     * @param {?=} animate
     * @return {?}
     */
    AnimationTransitionNamespace.prototype._destroyInnerNodes = function (rootElement, context, animate) {
        var _this = this;
        if (animate === void 0) { animate = false; }
        this._engine.driver.query(rootElement, NG_TRIGGER_SELECTOR, true).forEach(function (elm) {
            if (animate && containsClass(elm, _this._hostClassName)) {
                var /** @type {?} */ innerNs = _this._engine.namespacesByHostElement.get(elm);
                // special case for a host element with animations on the same element
                if (innerNs) {
                    innerNs.removeNode(elm, context, true);
                }
                _this.removeNode(elm, context, true);
            }
            else {
                _this.clearElementCache(elm);
            }
        });
    };
    /**
     * @param {?} element
     * @param {?} context
     * @param {?=} doNotRecurse
     * @return {?}
     */
    AnimationTransitionNamespace.prototype.removeNode = function (element, context, doNotRecurse) {
        var _this = this;
        var /** @type {?} */ engine = this._engine;
        if (!doNotRecurse && element.childElementCount) {
            this._destroyInnerNodes(element, context, true);
        }
        var /** @type {?} */ triggerStates = engine.statesByElement.get(element);
        if (triggerStates) {
            var /** @type {?} */ players_1 = [];
            Object.keys(triggerStates).forEach(function (triggerName) {
                // this check is here in the event that an element is removed
                // twice (both on the host level and the component level)
                if (_this._triggers[triggerName]) {
                    var /** @type {?} */ player = _this.trigger(element, triggerName, VOID_VALUE, false);
                    if (player) {
                        players_1.push(player);
                    }
                }
            });
            if (players_1.length) {
                engine.markElementAsRemoved(this.id, element, true, context);
                optimizeGroupPlayer(players_1).onDone(function () { return engine.processLeaveNode(element); });
                return;
            }
        }
        // find the player that is animating and make sure that the
        // removal is delayed until that player has completed
        var /** @type {?} */ containsPotentialParentTransition = false;
        if (engine.totalAnimations) {
            var /** @type {?} */ currentPlayers = engine.players.length ? engine.playersByQueriedElement.get(element) : [];
            // when this `if statement` does not continue forward it means that
            // a previous animation query has selected the current element and
            // is animating it. In this situation want to continue fowards and
            // allow the element to be queued up for animation later.
            if (currentPlayers && currentPlayers.length) {
                containsPotentialParentTransition = true;
            }
            else {
                var /** @type {?} */ parent = element;
                while (parent = parent.parentNode) {
                    var /** @type {?} */ triggers = engine.statesByElement.get(parent);
                    if (triggers) {
                        containsPotentialParentTransition = true;
                        break;
                    }
                }
            }
        }
        // at this stage we know that the element will either get removed
        // during flush or will be picked up by a parent query. Either way
        // we need to fire the listeners for this element when it DOES get
        // removed (once the query parent animation is done or after flush)
        var /** @type {?} */ listeners = this._elementListeners.get(element);
        if (listeners) {
            var /** @type {?} */ visitedTriggers_1 = new Set();
            listeners.forEach(function (listener) {
                var /** @type {?} */ triggerName = listener.name;
                if (visitedTriggers_1.has(triggerName))
                    return;
                visitedTriggers_1.add(triggerName);
                var /** @type {?} */ trigger = _this._triggers[triggerName];
                var /** @type {?} */ transition = trigger.fallbackTransition;
                var /** @type {?} */ elementStates = ((engine.statesByElement.get(element)));
                var /** @type {?} */ fromState = elementStates[triggerName] || DEFAULT_STATE_VALUE;
                var /** @type {?} */ toState = new StateValue(VOID_VALUE);
                var /** @type {?} */ player = new TransitionAnimationPlayer(_this.id, triggerName, element);
                _this._engine.totalQueuedPlayers++;
                _this._queue.push({
                    element: element,
                    triggerName: triggerName,
                    transition: transition,
                    fromState: fromState,
                    toState: toState,
                    player: player,
                    isFallbackTransition: true
                });
            });
        }
        // whether or not a parent has an animation we need to delay the deferral of the leave
        // operation until we have more information (which we do after flush() has been called)
        if (containsPotentialParentTransition) {
            engine.markElementAsRemoved(this.id, element, false, context);
        }
        else {
            // we do this after the flush has occurred such
            // that the callbacks can be fired
            engine.afterFlush(function () { return _this.clearElementCache(element); });
            engine.destroyInnerAnimations(element);
            engine._onRemovalComplete(element, context);
        }
    };
    /**
     * @param {?} element
     * @param {?} parent
     * @return {?}
     */
    AnimationTransitionNamespace.prototype.insertNode = function (element, parent) { addClass(element, this._hostClassName); };
    /**
     * @param {?} microtaskId
     * @return {?}
     */
    AnimationTransitionNamespace.prototype.drainQueuedTransitions = function (microtaskId) {
        var _this = this;
        var /** @type {?} */ instructions = [];
        this._queue.forEach(function (entry) {
            var /** @type {?} */ player = entry.player;
            if (player.destroyed)
                return;
            var /** @type {?} */ element = entry.element;
            var /** @type {?} */ listeners = _this._elementListeners.get(element);
            if (listeners) {
                listeners.forEach(function (listener) {
                    if (listener.name == entry.triggerName) {
                        var /** @type {?} */ baseEvent = makeAnimationEvent(element, entry.triggerName, entry.fromState.value, entry.toState.value);
                        ((baseEvent))['_data'] = microtaskId;
                        listenOnPlayer(entry.player, listener.phase, baseEvent, listener.callback);
                    }
                });
            }
            if (player.markedForDestroy) {
                _this._engine.afterFlush(function () {
                    // now we can destroy the element properly since the event listeners have
                    // been bound to the player
                    player.destroy();
                });
            }
            else {
                instructions.push(entry);
            }
        });
        this._queue = [];
        return instructions.sort(function (a, b) {
            // if depCount == 0 them move to front
            // otherwise if a contains b then move back
            var /** @type {?} */ d0 = a.transition.ast.depCount;
            var /** @type {?} */ d1 = b.transition.ast.depCount;
            if (d0 == 0 || d1 == 0) {
                return d0 - d1;
            }
            return _this._engine.driver.containsElement(a.element, b.element) ? 1 : -1;
        });
    };
    /**
     * @param {?} context
     * @return {?}
     */
    AnimationTransitionNamespace.prototype.destroy = function (context) {
        this.players.forEach(function (p) { return p.destroy(); });
        this._destroyInnerNodes(this.hostElement, context);
    };
    /**
     * @param {?} element
     * @return {?}
     */
    AnimationTransitionNamespace.prototype.elementContainsData = function (element) {
        var /** @type {?} */ containsData = false;
        if (this._elementListeners.has(element))
            containsData = true;
        containsData =
            (this._queue.find(function (entry) { return entry.element === element; }) ? true : false) || containsData;
        return containsData;
    };
    return AnimationTransitionNamespace;
}());
var TransitionAnimationEngine = (function () {
    /**
     * @param {?} driver
     * @param {?} _normalizer
     */
    function TransitionAnimationEngine(driver, _normalizer) {
        this.driver = driver;
        this._normalizer = _normalizer;
        this.players = [];
        this.newHostElements = new Map();
        this.playersByElement = new Map();
        this.playersByQueriedElement = new Map();
        this.statesByElement = new Map();
        this.disabledNodes = new Set();
        this.totalAnimations = 0;
        this.totalQueuedPlayers = 0;
        this._namespaceLookup = {};
        this._namespaceList = [];
        this._flushFns = [];
        this._whenQuietFns = [];
        this.namespacesByHostElement = new Map();
        this.collectedEnterElements = [];
        this.collectedLeaveElements = [];
        this.onRemovalComplete = function (element, context) { };
    }
    /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    TransitionAnimationEngine.prototype._onRemovalComplete = function (element, context) { this.onRemovalComplete(element, context); };
    Object.defineProperty(TransitionAnimationEngine.prototype, "queuedPlayers", {
        /**
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ players = [];
            this._namespaceList.forEach(function (ns) {
                ns.players.forEach(function (player) {
                    if (player.queued) {
                        players.push(player);
                    }
                });
            });
            return players;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} namespaceId
     * @param {?} hostElement
     * @return {?}
     */
    TransitionAnimationEngine.prototype.createNamespace = function (namespaceId, hostElement) {
        var /** @type {?} */ ns = new AnimationTransitionNamespace(namespaceId, hostElement, this);
        if (hostElement.parentNode) {
            this._balanceNamespaceList(ns, hostElement);
        }
        else {
            // defer this later until flush during when the host element has
            // been inserted so that we know exactly where to place it in
            // the namespace list
            this.newHostElements.set(hostElement, ns);
            // given that this host element is apart of the animation code, it
            // may or may not be inserted by a parent node that is an of an
            // animation renderer type. If this happens then we can still have
            // access to this item when we query for :enter nodes. If the parent
            // is a renderer then the set data-structure will normalize the entry
            this.collectEnterElement(hostElement);
        }
        return this._namespaceLookup[namespaceId] = ns;
    };
    /**
     * @param {?} ns
     * @param {?} hostElement
     * @return {?}
     */
    TransitionAnimationEngine.prototype._balanceNamespaceList = function (ns, hostElement) {
        var /** @type {?} */ limit = this._namespaceList.length - 1;
        if (limit >= 0) {
            var /** @type {?} */ found = false;
            for (var /** @type {?} */ i = limit; i >= 0; i--) {
                var /** @type {?} */ nextNamespace = this._namespaceList[i];
                if (this.driver.containsElement(nextNamespace.hostElement, hostElement)) {
                    this._namespaceList.splice(i + 1, 0, ns);
                    found = true;
                    break;
                }
            }
            if (!found) {
                this._namespaceList.splice(0, 0, ns);
            }
        }
        else {
            this._namespaceList.push(ns);
        }
        this.namespacesByHostElement.set(hostElement, ns);
        return ns;
    };
    /**
     * @param {?} namespaceId
     * @param {?} hostElement
     * @return {?}
     */
    TransitionAnimationEngine.prototype.register = function (namespaceId, hostElement) {
        var /** @type {?} */ ns = this._namespaceLookup[namespaceId];
        if (!ns) {
            ns = this.createNamespace(namespaceId, hostElement);
        }
        return ns;
    };
    /**
     * @param {?} namespaceId
     * @param {?} name
     * @param {?} trigger
     * @return {?}
     */
    TransitionAnimationEngine.prototype.registerTrigger = function (namespaceId, name, trigger) {
        var /** @type {?} */ ns = this._namespaceLookup[namespaceId];
        if (ns && ns.register(name, trigger)) {
            this.totalAnimations++;
        }
    };
    /**
     * @param {?} namespaceId
     * @param {?} context
     * @return {?}
     */
    TransitionAnimationEngine.prototype.destroy = function (namespaceId, context) {
        var _this = this;
        if (!namespaceId)
            return;
        var /** @type {?} */ ns = this._fetchNamespace(namespaceId);
        this.afterFlush(function () {
            _this.namespacesByHostElement.delete(ns.hostElement);
            delete _this._namespaceLookup[namespaceId];
            var /** @type {?} */ index = _this._namespaceList.indexOf(ns);
            if (index >= 0) {
                _this._namespaceList.splice(index, 1);
            }
        });
        this.afterFlushAnimationsDone(function () { return ns.destroy(context); });
    };
    /**
     * @param {?} id
     * @return {?}
     */
    TransitionAnimationEngine.prototype._fetchNamespace = function (id) { return this._namespaceLookup[id]; };
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    TransitionAnimationEngine.prototype.trigger = function (namespaceId, element, name, value) {
        if (isElementNode(element)) {
            this._fetchNamespace(namespaceId).trigger(element, name, value);
            return true;
        }
        return false;
    };
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} parent
     * @param {?} insertBefore
     * @return {?}
     */
    TransitionAnimationEngine.prototype.insertNode = function (namespaceId, element, parent, insertBefore) {
        if (!isElementNode(element))
            return;
        // special case for when an element is removed and reinserted (move operation)
        // when this occurs we do not want to use the element for deletion later
        var /** @type {?} */ details = (element[REMOVAL_FLAG]);
        if (details && details.setForRemoval) {
            details.setForRemoval = false;
        }
        // in the event that the namespaceId is blank then the caller
        // code does not contain any animation code in it, but it is
        // just being called so that the node is marked as being inserted
        if (namespaceId) {
            this._fetchNamespace(namespaceId).insertNode(element, parent);
        }
        // only *directives and host elements are inserted before
        if (insertBefore) {
            this.collectEnterElement(element);
        }
    };
    /**
     * @param {?} element
     * @return {?}
     */
    TransitionAnimationEngine.prototype.collectEnterElement = function (element) { this.collectedEnterElements.push(element); };
    /**
     * @param {?} element
     * @param {?} value
     * @return {?}
     */
    TransitionAnimationEngine.prototype.markElementAsDisabled = function (element, value) {
        if (value) {
            if (!this.disabledNodes.has(element)) {
                this.disabledNodes.add(element);
                addClass(element, DISABLED_CLASSNAME);
            }
        }
        else if (this.disabledNodes.has(element)) {
            this.disabledNodes.delete(element);
            removeClass(element, DISABLED_CLASSNAME);
        }
    };
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} context
     * @param {?=} doNotRecurse
     * @return {?}
     */
    TransitionAnimationEngine.prototype.removeNode = function (namespaceId, element, context, doNotRecurse) {
        if (!isElementNode(element)) {
            this._onRemovalComplete(element, context);
            return;
        }
        var /** @type {?} */ ns = namespaceId ? this._fetchNamespace(namespaceId) : null;
        if (ns) {
            ns.removeNode(element, context, doNotRecurse);
        }
        else {
            this.markElementAsRemoved(namespaceId, element, false, context);
        }
    };
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?=} hasAnimation
     * @param {?=} context
     * @return {?}
     */
    TransitionAnimationEngine.prototype.markElementAsRemoved = function (namespaceId, element, hasAnimation, context) {
        this.collectedLeaveElements.push(element);
        element[REMOVAL_FLAG] = {
            namespaceId: namespaceId,
            setForRemoval: context, hasAnimation: hasAnimation,
            removedBeforeQueried: false
        };
    };
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} name
     * @param {?} phase
     * @param {?} callback
     * @return {?}
     */
    TransitionAnimationEngine.prototype.listen = function (namespaceId, element, name, phase, callback) {
        if (isElementNode(element)) {
            return this._fetchNamespace(namespaceId).listen(element, name, phase, callback);
        }
        return function () { };
    };
    /**
     * @param {?} entry
     * @param {?} subTimelines
     * @return {?}
     */
    TransitionAnimationEngine.prototype._buildInstruction = function (entry, subTimelines) {
        return entry.transition.build(this.driver, entry.element, entry.fromState.value, entry.toState.value, entry.fromState.options, entry.toState.options, subTimelines);
    };
    /**
     * @param {?} containerElement
     * @return {?}
     */
    TransitionAnimationEngine.prototype.destroyInnerAnimations = function (containerElement) {
        var _this = this;
        var /** @type {?} */ elements = this.driver.query(containerElement, NG_TRIGGER_SELECTOR, true);
        elements.forEach(function (element) {
            var /** @type {?} */ players = _this.playersByElement.get(element);
            if (players) {
                players.forEach(function (player) {
                    // special case for when an element is set for destruction, but hasn't started.
                    // in this situation we want to delay the destruction until the flush occurs
                    // so that any event listeners attached to the player are triggered.
                    if (player.queued) {
                        player.markedForDestroy = true;
                    }
                    else {
                        player.destroy();
                    }
                });
            }
            var /** @type {?} */ stateMap = _this.statesByElement.get(element);
            if (stateMap) {
                Object.keys(stateMap).forEach(function (triggerName) { return stateMap[triggerName] = DELETED_STATE_VALUE; });
            }
        });
        if (this.playersByQueriedElement.size == 0)
            return;
        elements = this.driver.query(containerElement, NG_ANIMATING_SELECTOR, true);
        if (elements.length) {
            elements.forEach(function (element) {
                var /** @type {?} */ players = _this.playersByQueriedElement.get(element);
                if (players) {
                    players.forEach(function (player) { return player.finish(); });
                }
            });
        }
    };
    /**
     * @return {?}
     */
    TransitionAnimationEngine.prototype.whenRenderingDone = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (_this.players.length) {
                return optimizeGroupPlayer(_this.players).onDone(function () { return resolve(); });
            }
            else {
                resolve();
            }
        });
    };
    /**
     * @param {?} element
     * @return {?}
     */
    TransitionAnimationEngine.prototype.processLeaveNode = function (element) {
        var _this = this;
        var /** @type {?} */ details = (element[REMOVAL_FLAG]);
        if (details && details.setForRemoval) {
            // this will prevent it from removing it twice
            element[REMOVAL_FLAG] = NULL_REMOVAL_STATE;
            if (details.namespaceId) {
                this.destroyInnerAnimations(element);
                var /** @type {?} */ ns = this._fetchNamespace(details.namespaceId);
                if (ns) {
                    ns.clearElementCache(element);
                }
            }
            this._onRemovalComplete(element, details.setForRemoval);
        }
        if (this.driver.matchesElement(element, DISABLED_SELECTOR)) {
            this.markElementAsDisabled(element, false);
        }
        this.driver.query(element, DISABLED_SELECTOR, true).forEach(function (node) {
            _this.markElementAsDisabled(element, false);
        });
    };
    /**
     * @param {?=} microtaskId
     * @return {?}
     */
    TransitionAnimationEngine.prototype.flush = function (microtaskId) {
        var _this = this;
        if (microtaskId === void 0) { microtaskId = -1; }
        var /** @type {?} */ players = [];
        if (this.newHostElements.size) {
            this.newHostElements.forEach(function (ns, element) { return _this._balanceNamespaceList(ns, element); });
            this.newHostElements.clear();
        }
        if (this._namespaceList.length &&
            (this.totalQueuedPlayers || this.collectedLeaveElements.length)) {
            var /** @type {?} */ cleanupFns = [];
            try {
                players = this._flushAnimations(cleanupFns, microtaskId);
            }
            finally {
                for (var /** @type {?} */ i = 0; i < cleanupFns.length; i++) {
                    cleanupFns[i]();
                }
            }
        }
        else {
            for (var /** @type {?} */ i = 0; i < this.collectedLeaveElements.length; i++) {
                var /** @type {?} */ element = this.collectedLeaveElements[i];
                this.processLeaveNode(element);
            }
        }
        this.totalQueuedPlayers = 0;
        this.collectedEnterElements.length = 0;
        this.collectedLeaveElements.length = 0;
        this._flushFns.forEach(function (fn) { return fn(); });
        this._flushFns = [];
        if (this._whenQuietFns.length) {
            // we move these over to a variable so that
            // if any new callbacks are registered in another
            // flush they do not populate the existing set
            var /** @type {?} */ quietFns_1 = this._whenQuietFns;
            this._whenQuietFns = [];
            if (players.length) {
                optimizeGroupPlayer(players).onDone(function () { quietFns_1.forEach(function (fn) { return fn(); }); });
            }
            else {
                quietFns_1.forEach(function (fn) { return fn(); });
            }
        }
    };
    /**
     * @param {?} errors
     * @return {?}
     */
    TransitionAnimationEngine.prototype.reportError = function (errors) {
        throw new Error("Unable to process animations due to the following failed trigger transitions\n " + errors.join('\n'));
    };
    /**
     * @param {?} cleanupFns
     * @param {?} microtaskId
     * @return {?}
     */
    TransitionAnimationEngine.prototype._flushAnimations = function (cleanupFns, microtaskId) {
        var _this = this;
        var /** @type {?} */ subTimelines = new ElementInstructionMap();
        var /** @type {?} */ skippedPlayers = [];
        var /** @type {?} */ skippedPlayersMap = new Map();
        var /** @type {?} */ queuedInstructions = [];
        var /** @type {?} */ queriedElements = new Map();
        var /** @type {?} */ allPreStyleElements = new Map();
        var /** @type {?} */ allPostStyleElements = new Map();
        var /** @type {?} */ disabledElementsSet = new Set();
        this.disabledNodes.forEach(function (node) {
            disabledElementsSet.add(node);
            var /** @type {?} */ nodesThatAreDisabled = _this.driver.query(node, QUEUED_SELECTOR, true);
            for (var /** @type {?} */ i = 0; i < nodesThatAreDisabled.length; i++) {
                disabledElementsSet.add(nodesThatAreDisabled[i]);
            }
        });
        var /** @type {?} */ bodyNode = getBodyNode();
        var /** @type {?} */ allEnterNodes = this.collectedEnterElements.length ?
            this.collectedEnterElements.filter(createIsRootFilterFn(this.collectedEnterElements)) :
            [];
        // this must occur before the instructions are built below such that
        // the :enter queries match the elements (since the timeline queries
        // are fired during instruction building).
        for (var /** @type {?} */ i = 0; i < allEnterNodes.length; i++) {
            addClass(allEnterNodes[i], ENTER_CLASSNAME);
        }
        var /** @type {?} */ allLeaveNodes = [];
        var /** @type {?} */ leaveNodesWithoutAnimations = new Set();
        for (var /** @type {?} */ i = 0; i < this.collectedLeaveElements.length; i++) {
            var /** @type {?} */ element = this.collectedLeaveElements[i];
            var /** @type {?} */ details = (element[REMOVAL_FLAG]);
            if (details && details.setForRemoval) {
                addClass(element, LEAVE_CLASSNAME);
                allLeaveNodes.push(element);
                if (!details.hasAnimation) {
                    leaveNodesWithoutAnimations.add(element);
                }
            }
        }
        cleanupFns.push(function () {
            allEnterNodes.forEach(function (element) { return removeClass(element, ENTER_CLASSNAME); });
            allLeaveNodes.forEach(function (element) {
                removeClass(element, LEAVE_CLASSNAME);
                _this.processLeaveNode(element);
            });
        });
        var /** @type {?} */ allPlayers = [];
        var /** @type {?} */ erroneousTransitions = [];
        for (var /** @type {?} */ i = this._namespaceList.length - 1; i >= 0; i--) {
            var /** @type {?} */ ns = this._namespaceList[i];
            ns.drainQueuedTransitions(microtaskId).forEach(function (entry) {
                var /** @type {?} */ player = entry.player;
                allPlayers.push(player);
                var /** @type {?} */ element = entry.element;
                if (!bodyNode || !_this.driver.containsElement(bodyNode, element)) {
                    player.destroy();
                    return;
                }
                var /** @type {?} */ instruction = ((_this._buildInstruction(entry, subTimelines)));
                if (instruction.errors && instruction.errors.length) {
                    erroneousTransitions.push(instruction);
                    return;
                }
                // if a unmatched transition is queued to go then it SHOULD NOT render
                // an animation and cancel the previously running animations.
                if (entry.isFallbackTransition) {
                    player.onStart(function () { return eraseStyles(element, instruction.fromStyles); });
                    player.onDestroy(function () { return setStyles(element, instruction.toStyles); });
                    skippedPlayers.push(player);
                    return;
                }
                // this means that if a parent animation uses this animation as a sub trigger
                // then it will instruct the timeline builder to not add a player delay, but
                // instead stretch the first keyframe gap up until the animation starts. The
                // reason this is important is to prevent extra initialization styles from being
                // required by the user in the animation.
                instruction.timelines.forEach(function (tl) { return tl.stretchStartingKeyframe = true; });
                subTimelines.append(element, instruction.timelines);
                var /** @type {?} */ tuple = { instruction: instruction, player: player, element: element };
                queuedInstructions.push(tuple);
                instruction.queriedElements.forEach(function (element) { return getOrSetAsInMap(queriedElements, element, []).push(player); });
                instruction.preStyleProps.forEach(function (stringMap, element) {
                    var /** @type {?} */ props = Object.keys(stringMap);
                    if (props.length) {
                        var /** @type {?} */ setVal_1 = ((allPreStyleElements.get(element)));
                        if (!setVal_1) {
                            allPreStyleElements.set(element, setVal_1 = new Set());
                        }
                        props.forEach(function (prop) { return setVal_1.add(prop); });
                    }
                });
                instruction.postStyleProps.forEach(function (stringMap, element) {
                    var /** @type {?} */ props = Object.keys(stringMap);
                    var /** @type {?} */ setVal = ((allPostStyleElements.get(element)));
                    if (!setVal) {
                        allPostStyleElements.set(element, setVal = new Set());
                    }
                    props.forEach(function (prop) { return setVal.add(prop); });
                });
            });
        }
        if (erroneousTransitions.length) {
            var /** @type {?} */ errors_1 = [];
            erroneousTransitions.forEach(function (instruction) {
                errors_1.push("@" + instruction.triggerName + " has failed due to:\n"); /** @type {?} */
                ((instruction.errors)).forEach(function (error) { return errors_1.push("- " + error + "\n"); });
            });
            allPlayers.forEach(function (player) { return player.destroy(); });
            this.reportError(errors_1);
        }
        // these can only be detected here since we have a map of all the elements
        // that have animations attached to them... We use a set here in the event
        // multiple enter captures on the same element were caught in different
        // renderer namespaces (e.g. when a @trigger was on a host binding that had *ngIf)
        var /** @type {?} */ enterNodesWithoutAnimations = new Set();
        for (var /** @type {?} */ i = 0; i < allEnterNodes.length; i++) {
            var /** @type {?} */ element = allEnterNodes[i];
            if (!subTimelines.has(element)) {
                enterNodesWithoutAnimations.add(element);
            }
        }
        var /** @type {?} */ allPreviousPlayersMap = new Map();
        var /** @type {?} */ sortedParentElements = [];
        queuedInstructions.forEach(function (entry) {
            var /** @type {?} */ element = entry.element;
            if (subTimelines.has(element)) {
                sortedParentElements.unshift(element);
                _this._beforeAnimationBuild(entry.player.namespaceId, entry.instruction, allPreviousPlayersMap);
            }
        });
        skippedPlayers.forEach(function (player) {
            var /** @type {?} */ element = player.element;
            var /** @type {?} */ previousPlayers = _this._getPreviousPlayers(element, false, player.namespaceId, player.triggerName, null);
            previousPlayers.forEach(function (prevPlayer) {
                getOrSetAsInMap(allPreviousPlayersMap, element, []).push(prevPlayer);
                prevPlayer.destroy();
            });
        });
        // this is a special case for nodes that will be removed (either by)
        // having their own leave animations or by being queried in a container
        // that will be removed once a parent animation is complete. The idea
        // here is that * styles must be identical to ! styles because of
        // backwards compatibility (* is also filled in by default in many places).
        // Otherwise * styles will return an empty value or auto since the element
        // that is being getComputedStyle'd will not be visible (since * = destination)
        var /** @type {?} */ replaceNodes = allLeaveNodes.filter(function (node) {
            return replacePostStylesAsPre(node, allPreStyleElements, allPostStyleElements);
        });
        // POST STAGE: fill the * styles
        var _a = cloakAndComputeStyles(this.driver, leaveNodesWithoutAnimations, allPostStyleElements, __WEBPACK_IMPORTED_MODULE_1__angular_animations__["AUTO_STYLE"]), postStylesMap = _a[0], allLeaveQueriedNodes = _a[1];
        allLeaveQueriedNodes.forEach(function (node) {
            if (replacePostStylesAsPre(node, allPreStyleElements, allPostStyleElements)) {
                replaceNodes.push(node);
            }
        });
        // PRE STAGE: fill the ! styles
        var preStylesMap = (allPreStyleElements.size ?
            cloakAndComputeStyles(this.driver, enterNodesWithoutAnimations, allPreStyleElements, __WEBPACK_IMPORTED_MODULE_1__angular_animations__["ɵPRE_STYLE"]) :
            [new Map()])[0];
        replaceNodes.forEach(function (node) {
            var /** @type {?} */ post = postStylesMap.get(node);
            var /** @type {?} */ pre = preStylesMap.get(node);
            postStylesMap.set(node, /** @type {?} */ (Object.assign({}, post, pre)));
        });
        var /** @type {?} */ rootPlayers = [];
        var /** @type {?} */ subPlayers = [];
        queuedInstructions.forEach(function (entry) {
            var element = entry.element, player = entry.player, instruction = entry.instruction;
            // this means that it was never consumed by a parent animation which
            // means that it is independent and therefore should be set for animation
            if (subTimelines.has(element)) {
                if (disabledElementsSet.has(element)) {
                    skippedPlayers.push(player);
                    return;
                }
                var /** @type {?} */ innerPlayer = _this._buildAnimation(player.namespaceId, instruction, allPreviousPlayersMap, skippedPlayersMap, preStylesMap, postStylesMap);
                player.setRealPlayer(innerPlayer);
                var /** @type {?} */ parentHasPriority = null;
                for (var /** @type {?} */ i = 0; i < sortedParentElements.length; i++) {
                    var /** @type {?} */ parent = sortedParentElements[i];
                    if (parent === element)
                        break;
                    if (_this.driver.containsElement(parent, element)) {
                        parentHasPriority = parent;
                        break;
                    }
                }
                if (parentHasPriority) {
                    var /** @type {?} */ parentPlayers = _this.playersByElement.get(parentHasPriority);
                    if (parentPlayers && parentPlayers.length) {
                        player.parentPlayer = optimizeGroupPlayer(parentPlayers);
                    }
                    skippedPlayers.push(player);
                }
                else {
                    rootPlayers.push(player);
                }
            }
            else {
                eraseStyles(element, instruction.fromStyles);
                player.onDestroy(function () { return setStyles(element, instruction.toStyles); });
                // there still might be a ancestor player animating this
                // element therefore we will still add it as a sub player
                // even if its animation may be disabled
                subPlayers.push(player);
                if (disabledElementsSet.has(element)) {
                    skippedPlayers.push(player);
                }
            }
        });
        // find all of the sub players' corresponding inner animation player
        subPlayers.forEach(function (player) {
            // even if any players are not found for a sub animation then it
            // will still complete itself after the next tick since it's Noop
            var /** @type {?} */ playersForElement = skippedPlayersMap.get(player.element);
            if (playersForElement && playersForElement.length) {
                var /** @type {?} */ innerPlayer = optimizeGroupPlayer(playersForElement);
                player.setRealPlayer(innerPlayer);
            }
        });
        // the reason why we don't actually play the animation is
        // because all that a skipped player is designed to do is to
        // fire the start/done transition callback events
        skippedPlayers.forEach(function (player) {
            if (player.parentPlayer) {
                player.parentPlayer.onDestroy(function () { return player.destroy(); });
            }
            else {
                player.destroy();
            }
        });
        // run through all of the queued removals and see if they
        // were picked up by a query. If not then perform the removal
        // operation right away unless a parent animation is ongoing.
        for (var /** @type {?} */ i = 0; i < allLeaveNodes.length; i++) {
            var /** @type {?} */ element = allLeaveNodes[i];
            var /** @type {?} */ details = (element[REMOVAL_FLAG]);
            removeClass(element, LEAVE_CLASSNAME);
            // this means the element has a removal animation that is being
            // taken care of and therefore the inner elements will hang around
            // until that animation is over (or the parent queried animation)
            if (details && details.hasAnimation)
                continue;
            var /** @type {?} */ players = [];
            // if this element is queried or if it contains queried children
            // then we want for the element not to be removed from the page
            // until the queried animations have finished
            if (queriedElements.size) {
                var /** @type {?} */ queriedPlayerResults = queriedElements.get(element);
                if (queriedPlayerResults && queriedPlayerResults.length) {
                    players.push.apply(players, queriedPlayerResults);
                }
                var /** @type {?} */ queriedInnerElements = this.driver.query(element, NG_ANIMATING_SELECTOR, true);
                for (var /** @type {?} */ j = 0; j < queriedInnerElements.length; j++) {
                    var /** @type {?} */ queriedPlayers = queriedElements.get(queriedInnerElements[j]);
                    if (queriedPlayers && queriedPlayers.length) {
                        players.push.apply(players, queriedPlayers);
                    }
                }
            }
            var /** @type {?} */ activePlayers = players.filter(function (p) { return !p.destroyed; });
            if (activePlayers.length) {
                removeNodesAfterAnimationDone(this, element, activePlayers);
            }
            else {
                this.processLeaveNode(element);
            }
        }
        // this is required so the cleanup method doesn't remove them
        allLeaveNodes.length = 0;
        rootPlayers.forEach(function (player) {
            _this.players.push(player);
            player.onDone(function () {
                player.destroy();
                var /** @type {?} */ index = _this.players.indexOf(player);
                _this.players.splice(index, 1);
            });
            player.play();
        });
        return rootPlayers;
    };
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @return {?}
     */
    TransitionAnimationEngine.prototype.elementContainsData = function (namespaceId, element) {
        var /** @type {?} */ containsData = false;
        var /** @type {?} */ details = (element[REMOVAL_FLAG]);
        if (details && details.setForRemoval)
            containsData = true;
        if (this.playersByElement.has(element))
            containsData = true;
        if (this.playersByQueriedElement.has(element))
            containsData = true;
        if (this.statesByElement.has(element))
            containsData = true;
        return this._fetchNamespace(namespaceId).elementContainsData(element) || containsData;
    };
    /**
     * @param {?} callback
     * @return {?}
     */
    TransitionAnimationEngine.prototype.afterFlush = function (callback) { this._flushFns.push(callback); };
    /**
     * @param {?} callback
     * @return {?}
     */
    TransitionAnimationEngine.prototype.afterFlushAnimationsDone = function (callback) { this._whenQuietFns.push(callback); };
    /**
     * @param {?} element
     * @param {?} isQueriedElement
     * @param {?=} namespaceId
     * @param {?=} triggerName
     * @param {?=} toStateValue
     * @return {?}
     */
    TransitionAnimationEngine.prototype._getPreviousPlayers = function (element, isQueriedElement, namespaceId, triggerName, toStateValue) {
        var /** @type {?} */ players = [];
        if (isQueriedElement) {
            var /** @type {?} */ queriedElementPlayers = this.playersByQueriedElement.get(element);
            if (queriedElementPlayers) {
                players = queriedElementPlayers;
            }
        }
        else {
            var /** @type {?} */ elementPlayers = this.playersByElement.get(element);
            if (elementPlayers) {
                var /** @type {?} */ isRemovalAnimation_1 = !toStateValue || toStateValue == VOID_VALUE;
                elementPlayers.forEach(function (player) {
                    if (player.queued)
                        return;
                    if (!isRemovalAnimation_1 && player.triggerName != triggerName)
                        return;
                    players.push(player);
                });
            }
        }
        if (namespaceId || triggerName) {
            players = players.filter(function (player) {
                if (namespaceId && namespaceId != player.namespaceId)
                    return false;
                if (triggerName && triggerName != player.triggerName)
                    return false;
                return true;
            });
        }
        return players;
    };
    /**
     * @param {?} namespaceId
     * @param {?} instruction
     * @param {?} allPreviousPlayersMap
     * @return {?}
     */
    TransitionAnimationEngine.prototype._beforeAnimationBuild = function (namespaceId, instruction, allPreviousPlayersMap) {
        var _this = this;
        var /** @type {?} */ triggerName = instruction.triggerName;
        var /** @type {?} */ rootElement = instruction.element;
        // when a removal animation occurs, ALL previous players are collected
        // and destroyed (even if they are outside of the current namespace)
        var /** @type {?} */ targetNameSpaceId = instruction.isRemovalTransition ? undefined : namespaceId;
        var /** @type {?} */ targetTriggerName = instruction.isRemovalTransition ? undefined : triggerName;
        instruction.timelines.map(function (timelineInstruction) {
            var /** @type {?} */ element = timelineInstruction.element;
            var /** @type {?} */ isQueriedElement = element !== rootElement;
            var /** @type {?} */ players = getOrSetAsInMap(allPreviousPlayersMap, element, []);
            var /** @type {?} */ previousPlayers = _this._getPreviousPlayers(element, isQueriedElement, targetNameSpaceId, targetTriggerName, instruction.toState);
            previousPlayers.forEach(function (player) {
                var /** @type {?} */ realPlayer = (player.getRealPlayer());
                if (realPlayer.beforeDestroy) {
                    realPlayer.beforeDestroy();
                }
                player.destroy();
                players.push(player);
            });
        });
        // this needs to be done so that the PRE/POST styles can be
        // computed properly without interfering with the previous animation
        eraseStyles(rootElement, instruction.fromStyles);
    };
    /**
     * @param {?} namespaceId
     * @param {?} instruction
     * @param {?} allPreviousPlayersMap
     * @param {?} skippedPlayersMap
     * @param {?} preStylesMap
     * @param {?} postStylesMap
     * @return {?}
     */
    TransitionAnimationEngine.prototype._buildAnimation = function (namespaceId, instruction, allPreviousPlayersMap, skippedPlayersMap, preStylesMap, postStylesMap) {
        var _this = this;
        var /** @type {?} */ triggerName = instruction.triggerName;
        var /** @type {?} */ rootElement = instruction.element;
        // we first run this so that the previous animation player
        // data can be passed into the successive animation players
        var /** @type {?} */ allQueriedPlayers = [];
        var /** @type {?} */ allConsumedElements = new Set();
        var /** @type {?} */ allSubElements = new Set();
        var /** @type {?} */ allNewPlayers = instruction.timelines.map(function (timelineInstruction) {
            var /** @type {?} */ element = timelineInstruction.element;
            allConsumedElements.add(element);
            // FIXME (matsko): make sure to-be-removed animations are removed properly
            var /** @type {?} */ details = element[REMOVAL_FLAG];
            if (details && details.removedBeforeQueried)
                return new __WEBPACK_IMPORTED_MODULE_1__angular_animations__["NoopAnimationPlayer"]();
            var /** @type {?} */ isQueriedElement = element !== rootElement;
            var /** @type {?} */ previousPlayers = flattenGroupPlayers((allPreviousPlayersMap.get(element) || EMPTY_PLAYER_ARRAY)
                .map(function (p) { return p.getRealPlayer(); }))
                .filter(function (p) {
                // the `element` is not apart of the AnimationPlayer definition, but
                // Mock/WebAnimations
                // use the element within their implementation. This will be added in Angular5 to
                // AnimationPlayer
                var /** @type {?} */ pp = (p);
                return pp.element ? pp.element === element : false;
            });
            var /** @type {?} */ preStyles = preStylesMap.get(element);
            var /** @type {?} */ postStyles = postStylesMap.get(element);
            var /** @type {?} */ keyframes = normalizeKeyframes(_this.driver, _this._normalizer, element, timelineInstruction.keyframes, preStyles, postStyles);
            var /** @type {?} */ player = _this._buildPlayer(timelineInstruction, keyframes, previousPlayers);
            // this means that this particular player belongs to a sub trigger. It is
            // important that we match this player up with the corresponding (@trigger.listener)
            if (timelineInstruction.subTimeline && skippedPlayersMap) {
                allSubElements.add(element);
            }
            if (isQueriedElement) {
                var /** @type {?} */ wrappedPlayer = new TransitionAnimationPlayer(namespaceId, triggerName, element);
                wrappedPlayer.setRealPlayer(player);
                allQueriedPlayers.push(wrappedPlayer);
            }
            return player;
        });
        allQueriedPlayers.forEach(function (player) {
            getOrSetAsInMap(_this.playersByQueriedElement, player.element, []).push(player);
            player.onDone(function () { return deleteOrUnsetInMap(_this.playersByQueriedElement, player.element, player); });
        });
        allConsumedElements.forEach(function (element) { return addClass(element, NG_ANIMATING_CLASSNAME); });
        var /** @type {?} */ player = optimizeGroupPlayer(allNewPlayers);
        player.onDestroy(function () {
            allConsumedElements.forEach(function (element) { return removeClass(element, NG_ANIMATING_CLASSNAME); });
            setStyles(rootElement, instruction.toStyles);
        });
        // this basically makes all of the callbacks for sub element animations
        // be dependent on the upper players for when they finish
        allSubElements.forEach(function (element) { getOrSetAsInMap(skippedPlayersMap, element, []).push(player); });
        return player;
    };
    /**
     * @param {?} instruction
     * @param {?} keyframes
     * @param {?} previousPlayers
     * @return {?}
     */
    TransitionAnimationEngine.prototype._buildPlayer = function (instruction, keyframes, previousPlayers) {
        if (keyframes.length > 0) {
            return this.driver.animate(instruction.element, keyframes, instruction.duration, instruction.delay, instruction.easing, previousPlayers);
        }
        // special case for when an empty transition|definition is provided
        // ... there is no point in rendering an empty animation
        return new __WEBPACK_IMPORTED_MODULE_1__angular_animations__["NoopAnimationPlayer"]();
    };
    return TransitionAnimationEngine;
}());
var TransitionAnimationPlayer = (function () {
    /**
     * @param {?} namespaceId
     * @param {?} triggerName
     * @param {?} element
     */
    function TransitionAnimationPlayer(namespaceId, triggerName, element) {
        this.namespaceId = namespaceId;
        this.triggerName = triggerName;
        this.element = element;
        this._player = new __WEBPACK_IMPORTED_MODULE_1__angular_animations__["NoopAnimationPlayer"]();
        this._containsRealPlayer = false;
        this._queuedCallbacks = {};
        this._destroyed = false;
        this.markedForDestroy = false;
    }
    Object.defineProperty(TransitionAnimationPlayer.prototype, "queued", {
        /**
         * @return {?}
         */
        get: function () { return this._containsRealPlayer == false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TransitionAnimationPlayer.prototype, "destroyed", {
        /**
         * @return {?}
         */
        get: function () { return this._destroyed; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} player
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.setRealPlayer = function (player) {
        var _this = this;
        if (this._containsRealPlayer)
            return;
        this._player = player;
        Object.keys(this._queuedCallbacks).forEach(function (phase) {
            _this._queuedCallbacks[phase].forEach(function (callback) { return listenOnPlayer(player, phase, undefined, callback); });
        });
        this._queuedCallbacks = {};
        this._containsRealPlayer = true;
    };
    /**
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.getRealPlayer = function () { return this._player; };
    /**
     * @param {?} name
     * @param {?} callback
     * @return {?}
     */
    TransitionAnimationPlayer.prototype._queueEvent = function (name, callback) {
        getOrSetAsInMap(this._queuedCallbacks, name, []).push(callback);
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.onDone = function (fn) {
        if (this.queued) {
            this._queueEvent('done', fn);
        }
        this._player.onDone(fn);
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.onStart = function (fn) {
        if (this.queued) {
            this._queueEvent('start', fn);
        }
        this._player.onStart(fn);
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.onDestroy = function (fn) {
        if (this.queued) {
            this._queueEvent('destroy', fn);
        }
        this._player.onDestroy(fn);
    };
    /**
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.init = function () { this._player.init(); };
    /**
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.hasStarted = function () { return this.queued ? false : this._player.hasStarted(); };
    /**
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.play = function () { !this.queued && this._player.play(); };
    /**
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.pause = function () { !this.queued && this._player.pause(); };
    /**
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.restart = function () { !this.queued && this._player.restart(); };
    /**
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.finish = function () { this._player.finish(); };
    /**
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.destroy = function () {
        this._destroyed = true;
        this._player.destroy();
    };
    /**
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.reset = function () { !this.queued && this._player.reset(); };
    /**
     * @param {?} p
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.setPosition = function (p) {
        if (!this.queued) {
            this._player.setPosition(p);
        }
    };
    /**
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.getPosition = function () { return this.queued ? 0 : this._player.getPosition(); };
    Object.defineProperty(TransitionAnimationPlayer.prototype, "totalTime", {
        /**
         * @return {?}
         */
        get: function () { return this._player.totalTime; },
        enumerable: true,
        configurable: true
    });
    return TransitionAnimationPlayer;
}());
/**
 * @param {?} map
 * @param {?} key
 * @param {?} value
 * @return {?}
 */
function deleteOrUnsetInMap(map, key, value) {
    var /** @type {?} */ currentValues;
    if (map instanceof Map) {
        currentValues = map.get(key);
        if (currentValues) {
            if (currentValues.length) {
                var /** @type {?} */ index = currentValues.indexOf(value);
                currentValues.splice(index, 1);
            }
            if (currentValues.length == 0) {
                map.delete(key);
            }
        }
    }
    else {
        currentValues = map[key];
        if (currentValues) {
            if (currentValues.length) {
                var /** @type {?} */ index = currentValues.indexOf(value);
                currentValues.splice(index, 1);
            }
            if (currentValues.length == 0) {
                delete map[key];
            }
        }
    }
    return currentValues;
}
/**
 * @param {?} value
 * @return {?}
 */
function normalizeTriggerValue(value) {
    // we use `!= null` here because it's the most simple
    // way to test against a "falsy" value without mixing
    // in empty strings or a zero value. DO NOT OPTIMIZE.
    return value != null ? value : null;
}
/**
 * @param {?} node
 * @return {?}
 */
function isElementNode(node) {
    return node && node['nodeType'] === 1;
}
/**
 * @param {?} eventName
 * @return {?}
 */
function isTriggerEventValid(eventName) {
    return eventName == 'start' || eventName == 'done';
}
/**
 * @param {?} element
 * @param {?=} value
 * @return {?}
 */
function cloakElement(element, value) {
    var /** @type {?} */ oldValue = element.style.display;
    element.style.display = value != null ? value : 'none';
    return oldValue;
}
/**
 * @param {?} driver
 * @param {?} elements
 * @param {?} elementPropsMap
 * @param {?} defaultStyle
 * @return {?}
 */
function cloakAndComputeStyles(driver, elements, elementPropsMap, defaultStyle) {
    var /** @type {?} */ cloakVals = [];
    elements.forEach(function (element) { return cloakVals.push(cloakElement(element)); });
    var /** @type {?} */ valuesMap = new Map();
    var /** @type {?} */ failedElements = [];
    elementPropsMap.forEach(function (props, element) {
        var /** @type {?} */ styles = {};
        props.forEach(function (prop) {
            var /** @type {?} */ value = styles[prop] = driver.computeStyle(element, prop, defaultStyle);
            // there is no easy way to detect this because a sub element could be removed
            // by a parent animation element being detached.
            if (!value || value.length == 0) {
                element[REMOVAL_FLAG] = NULL_REMOVED_QUERIED_STATE;
                failedElements.push(element);
            }
        });
        valuesMap.set(element, styles);
    });
    // we use a index variable here since Set.forEach(a, i) does not return
    // an index value for the closure (but instead just the value)
    var /** @type {?} */ i = 0;
    elements.forEach(function (element) { return cloakElement(element, cloakVals[i++]); });
    return [valuesMap, failedElements];
}
/**
 * @param {?} nodes
 * @return {?}
 */
function createIsRootFilterFn(nodes) {
    var /** @type {?} */ nodeSet = new Set(nodes);
    var /** @type {?} */ knownRootContainer = new Set();
    var /** @type {?} */ isRoot;
    isRoot = function (node) {
        if (!node)
            return true;
        if (nodeSet.has(node.parentNode))
            return false;
        if (knownRootContainer.has(node.parentNode))
            return true;
        if (isRoot(node.parentNode)) {
            knownRootContainer.add(node);
            return true;
        }
        return false;
    };
    return isRoot;
}
var CLASSES_CACHE_KEY = '$$classes';
/**
 * @param {?} element
 * @param {?} className
 * @return {?}
 */
function containsClass(element, className) {
    if (element.classList) {
        return element.classList.contains(className);
    }
    else {
        var /** @type {?} */ classes = element[CLASSES_CACHE_KEY];
        return classes && classes[className];
    }
}
/**
 * @param {?} element
 * @param {?} className
 * @return {?}
 */
function addClass(element, className) {
    if (element.classList) {
        element.classList.add(className);
    }
    else {
        var /** @type {?} */ classes = element[CLASSES_CACHE_KEY];
        if (!classes) {
            classes = element[CLASSES_CACHE_KEY] = {};
        }
        classes[className] = true;
    }
}
/**
 * @param {?} element
 * @param {?} className
 * @return {?}
 */
function removeClass(element, className) {
    if (element.classList) {
        element.classList.remove(className);
    }
    else {
        var /** @type {?} */ classes = element[CLASSES_CACHE_KEY];
        if (classes) {
            delete classes[className];
        }
    }
}
/**
 * @return {?}
 */
function getBodyNode() {
    if (typeof document != 'undefined') {
        return document.body;
    }
    return null;
}
/**
 * @param {?} engine
 * @param {?} element
 * @param {?} players
 * @return {?}
 */
function removeNodesAfterAnimationDone(engine, element, players) {
    optimizeGroupPlayer(players).onDone(function () { return engine.processLeaveNode(element); });
}
/**
 * @param {?} players
 * @return {?}
 */
function flattenGroupPlayers(players) {
    var /** @type {?} */ finalPlayers = [];
    _flattenGroupPlayersRecur(players, finalPlayers);
    return finalPlayers;
}
/**
 * @param {?} players
 * @param {?} finalPlayers
 * @return {?}
 */
function _flattenGroupPlayersRecur(players, finalPlayers) {
    for (var /** @type {?} */ i = 0; i < players.length; i++) {
        var /** @type {?} */ player = players[i];
        if (player instanceof __WEBPACK_IMPORTED_MODULE_1__angular_animations__["ɵAnimationGroupPlayer"]) {
            _flattenGroupPlayersRecur(player.players, finalPlayers);
        }
        else {
            finalPlayers.push(/** @type {?} */ (player));
        }
    }
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function objEquals(a, b) {
    var /** @type {?} */ k1 = Object.keys(a);
    var /** @type {?} */ k2 = Object.keys(b);
    if (k1.length != k2.length)
        return false;
    for (var /** @type {?} */ i = 0; i < k1.length; i++) {
        var /** @type {?} */ prop = k1[i];
        if (!b.hasOwnProperty(prop) || a[prop] !== b[prop])
            return false;
    }
    return true;
}
/**
 * @param {?} element
 * @param {?} allPreStyleElements
 * @param {?} allPostStyleElements
 * @return {?}
 */
function replacePostStylesAsPre(element, allPreStyleElements, allPostStyleElements) {
    var /** @type {?} */ postEntry = allPostStyleElements.get(element);
    if (!postEntry)
        return false;
    var /** @type {?} */ preEntry = allPreStyleElements.get(element);
    if (preEntry) {
        postEntry.forEach(function (data) { return ((preEntry)).add(data); });
    }
    else {
        allPreStyleElements.set(element, postEntry);
    }
    allPostStyleElements.delete(element);
    return true;
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var AnimationEngine = (function () {
    /**
     * @param {?} driver
     * @param {?} normalizer
     */
    function AnimationEngine(driver, normalizer) {
        var _this = this;
        this._triggerCache = {};
        this.onRemovalComplete = function (element, context) { };
        this._transitionEngine = new TransitionAnimationEngine(driver, normalizer);
        this._timelineEngine = new TimelineAnimationEngine(driver, normalizer);
        this._transitionEngine.onRemovalComplete = function (element, context) { return _this.onRemovalComplete(element, context); };
    }
    /**
     * @param {?} componentId
     * @param {?} namespaceId
     * @param {?} hostElement
     * @param {?} name
     * @param {?} metadata
     * @return {?}
     */
    AnimationEngine.prototype.registerTrigger = function (componentId, namespaceId, hostElement, name, metadata) {
        var /** @type {?} */ cacheKey = componentId + '-' + name;
        var /** @type {?} */ trigger = this._triggerCache[cacheKey];
        if (!trigger) {
            var /** @type {?} */ errors = [];
            var /** @type {?} */ ast = (buildAnimationAst(/** @type {?} */ (metadata), errors));
            if (errors.length) {
                throw new Error("The animation trigger \"" + name + "\" has failed to build due to the following errors:\n - " + errors.join("\n - "));
            }
            trigger = buildTrigger(name, ast);
            this._triggerCache[cacheKey] = trigger;
        }
        this._transitionEngine.registerTrigger(namespaceId, name, trigger);
    };
    /**
     * @param {?} namespaceId
     * @param {?} hostElement
     * @return {?}
     */
    AnimationEngine.prototype.register = function (namespaceId, hostElement) {
        this._transitionEngine.register(namespaceId, hostElement);
    };
    /**
     * @param {?} namespaceId
     * @param {?} context
     * @return {?}
     */
    AnimationEngine.prototype.destroy = function (namespaceId, context) {
        this._transitionEngine.destroy(namespaceId, context);
    };
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} parent
     * @param {?} insertBefore
     * @return {?}
     */
    AnimationEngine.prototype.onInsert = function (namespaceId, element, parent, insertBefore) {
        this._transitionEngine.insertNode(namespaceId, element, parent, insertBefore);
    };
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    AnimationEngine.prototype.onRemove = function (namespaceId, element, context) {
        this._transitionEngine.removeNode(namespaceId, element, context);
    };
    /**
     * @param {?} element
     * @param {?} disable
     * @return {?}
     */
    AnimationEngine.prototype.disableAnimations = function (element, disable) {
        this._transitionEngine.markElementAsDisabled(element, disable);
    };
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} property
     * @param {?} value
     * @return {?}
     */
    AnimationEngine.prototype.process = function (namespaceId, element, property, value) {
        if (property.charAt(0) == '@') {
            var _a = parseTimelineCommand(property), id = _a[0], action = _a[1];
            var /** @type {?} */ args = (value);
            this._timelineEngine.command(id, element, action, args);
        }
        else {
            this._transitionEngine.trigger(namespaceId, element, property, value);
        }
    };
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} eventName
     * @param {?} eventPhase
     * @param {?} callback
     * @return {?}
     */
    AnimationEngine.prototype.listen = function (namespaceId, element, eventName, eventPhase, callback) {
        // @@listen
        if (eventName.charAt(0) == '@') {
            var _a = parseTimelineCommand(eventName), id = _a[0], action = _a[1];
            return this._timelineEngine.listen(id, element, action, callback);
        }
        return this._transitionEngine.listen(namespaceId, element, eventName, eventPhase, callback);
    };
    /**
     * @param {?=} microtaskId
     * @return {?}
     */
    AnimationEngine.prototype.flush = function (microtaskId) {
        if (microtaskId === void 0) { microtaskId = -1; }
        this._transitionEngine.flush(microtaskId);
    };
    Object.defineProperty(AnimationEngine.prototype, "players", {
        /**
         * @return {?}
         */
        get: function () {
            return ((this._transitionEngine.players))
                .concat(/** @type {?} */ (this._timelineEngine.players));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    AnimationEngine.prototype.whenRenderingDone = function () { return this._transitionEngine.whenRenderingDone(); };
    return AnimationEngine;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var WebAnimationsPlayer = (function () {
    /**
     * @param {?} element
     * @param {?} keyframes
     * @param {?} options
     * @param {?=} previousPlayers
     */
    function WebAnimationsPlayer(element, keyframes, options, previousPlayers) {
        if (previousPlayers === void 0) { previousPlayers = []; }
        var _this = this;
        this.element = element;
        this.keyframes = keyframes;
        this.options = options;
        this.previousPlayers = previousPlayers;
        this._onDoneFns = [];
        this._onStartFns = [];
        this._onDestroyFns = [];
        this._initialized = false;
        this._finished = false;
        this._started = false;
        this._destroyed = false;
        this.time = 0;
        this.parentPlayer = null;
        this.previousStyles = {};
        this.currentSnapshot = {};
        this._duration = options['duration'];
        this._delay = options['delay'] || 0;
        this.time = this._duration + this._delay;
        if (allowPreviousPlayerStylesMerge(this._duration, this._delay)) {
            previousPlayers.forEach(function (player) {
                var styles = player.currentSnapshot;
                Object.keys(styles).forEach(function (prop) { return _this.previousStyles[prop] = styles[prop]; });
            });
        }
    }
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype._onFinish = function () {
        if (!this._finished) {
            this._finished = true;
            this._onDoneFns.forEach(function (fn) { return fn(); });
            this._onDoneFns = [];
        }
    };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.init = function () {
        this._buildPlayer();
        this._preparePlayerBeforeStart();
    };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype._buildPlayer = function () {
        var _this = this;
        if (this._initialized)
            return;
        this._initialized = true;
        var /** @type {?} */ keyframes = this.keyframes.map(function (styles) { return copyStyles(styles, false); });
        var /** @type {?} */ previousStyleProps = Object.keys(this.previousStyles);
        if (previousStyleProps.length) {
            var /** @type {?} */ startingKeyframe_1 = keyframes[0];
            var /** @type {?} */ missingStyleProps_1 = [];
            previousStyleProps.forEach(function (prop) {
                if (!startingKeyframe_1.hasOwnProperty(prop)) {
                    missingStyleProps_1.push(prop);
                }
                startingKeyframe_1[prop] = _this.previousStyles[prop];
            });
            if (missingStyleProps_1.length) {
                var /** @type {?} */ self_1 = this;
                var _loop_1 = function () {
                    var /** @type {?} */ kf = keyframes[i];
                    missingStyleProps_1.forEach(function (prop) {
                        kf[prop] = _computeStyle(self_1.element, prop);
                    });
                };
                // tslint:disable-next-line
                for (var /** @type {?} */ i = 1; i < keyframes.length; i++) {
                    _loop_1();
                }
            }
        }
        this._player = this._triggerWebAnimation(this.element, keyframes, this.options);
        this._finalKeyframe = keyframes.length ? keyframes[keyframes.length - 1] : {};
        this._player.addEventListener('finish', function () { return _this._onFinish(); });
    };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype._preparePlayerBeforeStart = function () {
        // this is required so that the player doesn't start to animate right away
        if (this._delay) {
            this._resetDomPlayerState();
        }
        else {
            this._player.pause();
        }
    };
    /**
     * \@internal
     * @param {?} element
     * @param {?} keyframes
     * @param {?} options
     * @return {?}
     */
    WebAnimationsPlayer.prototype._triggerWebAnimation = function (element, keyframes, options) {
        // jscompiler doesn't seem to know animate is a native property because it's not fully
        // supported yet across common browsers (we polyfill it for Edge/Safari) [CL #143630929]
        return (element['animate'](keyframes, options));
    };
    Object.defineProperty(WebAnimationsPlayer.prototype, "domPlayer", {
        /**
         * @return {?}
         */
        get: function () { return this._player; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} fn
     * @return {?}
     */
    WebAnimationsPlayer.prototype.onStart = function (fn) { this._onStartFns.push(fn); };
    /**
     * @param {?} fn
     * @return {?}
     */
    WebAnimationsPlayer.prototype.onDone = function (fn) { this._onDoneFns.push(fn); };
    /**
     * @param {?} fn
     * @return {?}
     */
    WebAnimationsPlayer.prototype.onDestroy = function (fn) { this._onDestroyFns.push(fn); };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.play = function () {
        this._buildPlayer();
        if (!this.hasStarted()) {
            this._onStartFns.forEach(function (fn) { return fn(); });
            this._onStartFns = [];
            this._started = true;
        }
        this._player.play();
    };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.pause = function () {
        this.init();
        this._player.pause();
    };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.finish = function () {
        this.init();
        this._onFinish();
        this._player.finish();
    };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.reset = function () {
        this._resetDomPlayerState();
        this._destroyed = false;
        this._finished = false;
        this._started = false;
    };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype._resetDomPlayerState = function () {
        if (this._player) {
            this._player.cancel();
        }
    };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.restart = function () {
        this.reset();
        this.play();
    };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.hasStarted = function () { return this._started; };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.destroy = function () {
        if (!this._destroyed) {
            this._destroyed = true;
            this._resetDomPlayerState();
            this._onFinish();
            this._onDestroyFns.forEach(function (fn) { return fn(); });
            this._onDestroyFns = [];
        }
    };
    /**
     * @param {?} p
     * @return {?}
     */
    WebAnimationsPlayer.prototype.setPosition = function (p) { this._player.currentTime = p * this.time; };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.getPosition = function () { return this._player.currentTime / this.time; };
    Object.defineProperty(WebAnimationsPlayer.prototype, "totalTime", {
        /**
         * @return {?}
         */
        get: function () { return this._delay + this._duration; },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.beforeDestroy = function () {
        var _this = this;
        var /** @type {?} */ styles = {};
        if (this.hasStarted()) {
            Object.keys(this._finalKeyframe).forEach(function (prop) {
                if (prop != 'offset') {
                    styles[prop] =
                        _this._finished ? _this._finalKeyframe[prop] : _computeStyle(_this.element, prop);
                }
            });
        }
        this.currentSnapshot = styles;
    };
    return WebAnimationsPlayer;
}());
/**
 * @param {?} element
 * @param {?} prop
 * @return {?}
 */
function _computeStyle(element, prop) {
    return ((window.getComputedStyle(element)))[prop];
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var WebAnimationsDriver = (function () {
    function WebAnimationsDriver() {
    }
    /**
     * @param {?} element
     * @param {?} selector
     * @return {?}
     */
    WebAnimationsDriver.prototype.matchesElement = function (element, selector) {
        return matchesElement(element, selector);
    };
    /**
     * @param {?} elm1
     * @param {?} elm2
     * @return {?}
     */
    WebAnimationsDriver.prototype.containsElement = function (elm1, elm2) { return containsElement(elm1, elm2); };
    /**
     * @param {?} element
     * @param {?} selector
     * @param {?} multi
     * @return {?}
     */
    WebAnimationsDriver.prototype.query = function (element, selector, multi) {
        return invokeQuery(element, selector, multi);
    };
    /**
     * @param {?} element
     * @param {?} prop
     * @param {?=} defaultValue
     * @return {?}
     */
    WebAnimationsDriver.prototype.computeStyle = function (element, prop, defaultValue) {
        return (((window.getComputedStyle(element)))[prop]);
    };
    /**
     * @param {?} element
     * @param {?} keyframes
     * @param {?} duration
     * @param {?} delay
     * @param {?} easing
     * @param {?=} previousPlayers
     * @return {?}
     */
    WebAnimationsDriver.prototype.animate = function (element, keyframes, duration, delay, easing, previousPlayers) {
        if (previousPlayers === void 0) { previousPlayers = []; }
        var /** @type {?} */ fill = delay == 0 ? 'both' : 'forwards';
        var /** @type {?} */ playerOptions = { duration: duration, delay: delay, fill: fill };
        // we check for this to avoid having a null|undefined value be present
        // for the easing (which results in an error for certain browsers #9752)
        if (easing) {
            playerOptions['easing'] = easing;
        }
        var /** @type {?} */ previousWebAnimationPlayers = (previousPlayers.filter(function (player) { return player instanceof WebAnimationsPlayer; }));
        return new WebAnimationsPlayer(element, keyframes, playerOptions, previousWebAnimationPlayers);
    };
    return WebAnimationsDriver;
}());
/**
 * @return {?}
 */
function supportsWebAnimations() {
    return typeof Element !== 'undefined' && typeof ((Element)).prototype['animate'] === 'function';
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @module
 * @description
 * Entry point for all animation APIs of the animation browser package.
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @module
 * @description
 * Entry point for all public APIs of the animation package.
 */
/**
 * Generated bundle index. Do not edit.
 */

//# sourceMappingURL=browser.es5.js.map


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* unused harmony export getBaseUrl */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser_animations__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_module_shared__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_app_app_component__ = __webpack_require__(8);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            bootstrap: [__WEBPACK_IMPORTED_MODULE_4__components_app_app_component__["a" /* AppComponent */]],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["BrowserModule"],
                __WEBPACK_IMPORTED_MODULE_3__app_module_shared__["a" /* AppModuleShared */],
                __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */]
            ],
            providers: [
                { provide: 'BASE_URL', useFactory: getBaseUrl }
            ]
        })
    ], AppModule);
    return AppModule;
}());

function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModuleShared; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_router__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_platform_browser__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_platform_browser_animations__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_page_service__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_account_service__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_app_app_component__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_navmenu_navmenu_component__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_text_text_component__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_team_team_component__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_teammate_teammate_component__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__components_footer_footer_component__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__fab_fab_component__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__components_sidebars_textsidebar_textsidebar_component__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__components_sidebars_teamsidebar_teamsidebar_component__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__components_sidebars_personsidebar_personsidebar_component__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__components_sidebars_productsidebar_productsidebar_component__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__components_sidebars_gallerysidebar_gallerysidebar_component__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__components_sidebars_searchsidebar_searchsidebar_component__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__components_searchable_searchable_component__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__components_person_person_component__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__components_product_product_component__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__components_gallery_gallery_component__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__components_login_login_component__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__devbutton_devbutton_component__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__components_btns_editbtn_editbtn_component__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__components_btns_trash_btn_trashbtn_component__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__components_btns_up_btn_upbtn_component__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__components_btns_down_btn_downbtn_component__ = __webpack_require__(22);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
















//import { Page } from './page';
















var AppModuleShared = (function () {
    function AppModuleShared() {
    }
    AppModuleShared = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_9__components_app_app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_10__components_navmenu_navmenu_component__["a" /* NavMenuComponent */],
                __WEBPACK_IMPORTED_MODULE_11__components_text_text_component__["a" /* TextComponent */],
                __WEBPACK_IMPORTED_MODULE_12__components_team_team_component__["a" /* TeamComponent */],
                __WEBPACK_IMPORTED_MODULE_13__components_teammate_teammate_component__["a" /* TeammateComponent */],
                __WEBPACK_IMPORTED_MODULE_14__components_footer_footer_component__["a" /* FooterComponent */],
                __WEBPACK_IMPORTED_MODULE_15__fab_fab_component__["a" /* FabComponent */],
                __WEBPACK_IMPORTED_MODULE_23__components_person_person_component__["a" /* PersonComponent */],
                __WEBPACK_IMPORTED_MODULE_24__components_product_product_component__["a" /* ProductComponent */],
                __WEBPACK_IMPORTED_MODULE_16__components_sidebars_textsidebar_textsidebar_component__["a" /* TextSidebarComponent */],
                __WEBPACK_IMPORTED_MODULE_17__components_sidebars_teamsidebar_teamsidebar_component__["a" /* TeamSidebarComponent */],
                __WEBPACK_IMPORTED_MODULE_18__components_sidebars_personsidebar_personsidebar_component__["a" /* PersonSidebarComponent */],
                __WEBPACK_IMPORTED_MODULE_19__components_sidebars_productsidebar_productsidebar_component__["a" /* ProductSidebarComponent */],
                __WEBPACK_IMPORTED_MODULE_20__components_sidebars_gallerysidebar_gallerysidebar_component__["a" /* GallerySidebarComponent */],
                __WEBPACK_IMPORTED_MODULE_21__components_sidebars_searchsidebar_searchsidebar_component__["a" /* SearchSidebarComponent */],
                __WEBPACK_IMPORTED_MODULE_22__components_searchable_searchable_component__["a" /* SearchableComponent */],
                __WEBPACK_IMPORTED_MODULE_25__components_gallery_gallery_component__["a" /* GalleryComponent */],
                __WEBPACK_IMPORTED_MODULE_26__components_login_login_component__["a" /* LoginComponent */],
                __WEBPACK_IMPORTED_MODULE_27__devbutton_devbutton_component__["a" /* DevButtonComponent */],
                __WEBPACK_IMPORTED_MODULE_28__components_btns_editbtn_editbtn_component__["a" /* EditButtonComponent */],
                __WEBPACK_IMPORTED_MODULE_29__components_btns_trash_btn_trashbtn_component__["a" /* TrashButtonComponent */],
                __WEBPACK_IMPORTED_MODULE_30__components_btns_up_btn_upbtn_component__["a" /* UpButtonComponent */],
                __WEBPACK_IMPORTED_MODULE_31__components_btns_down_btn_downbtn_component__["a" /* DownButtonComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_5__angular_platform_browser__["BrowserModule"],
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["HttpModule"],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormsModule"],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["ReactiveFormsModule"],
                __WEBPACK_IMPORTED_MODULE_6__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */],
                __WEBPACK_IMPORTED_MODULE_4__angular_router__["RouterModule"].forRoot([
                    { path: '', redirectTo: 'home', pathMatch: 'full' },
                    { path: 'home', component: __WEBPACK_IMPORTED_MODULE_11__components_text_text_component__["a" /* TextComponent */] },
                    { path: 'text', component: __WEBPACK_IMPORTED_MODULE_11__components_text_text_component__["a" /* TextComponent */] },
                    { path: 'team', component: __WEBPACK_IMPORTED_MODULE_12__components_team_team_component__["a" /* TeamComponent */] },
                    { path: 'footer', component: __WEBPACK_IMPORTED_MODULE_14__components_footer_footer_component__["a" /* FooterComponent */] },
                    { path: 'person', component: __WEBPACK_IMPORTED_MODULE_23__components_person_person_component__["a" /* PersonComponent */] },
                    { path: 'product', component: __WEBPACK_IMPORTED_MODULE_24__components_product_product_component__["a" /* ProductComponent */] },
                    { path: '**', redirectTo: 'home' }
                ])
            ],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_25__components_gallery_gallery_component__["a" /* GalleryComponent */],
                __WEBPACK_IMPORTED_MODULE_11__components_text_text_component__["a" /* TextComponent */],
                __WEBPACK_IMPORTED_MODULE_23__components_person_person_component__["a" /* PersonComponent */],
                __WEBPACK_IMPORTED_MODULE_12__components_team_team_component__["a" /* TeamComponent */],
                __WEBPACK_IMPORTED_MODULE_24__components_product_product_component__["a" /* ProductComponent */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_7__services_page_service__["a" /* PageService */], __WEBPACK_IMPORTED_MODULE_8__services_account_service__["a" /* AccountService */]
            ]
        })
    ], AppModuleShared);
    return AppModuleShared;
}());



/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DownButtonComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var DownButtonComponent = (function () {
    function DownButtonComponent() {
    }
    DownButtonComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'down-btn',
            template: __webpack_require__(62)
        })
    ], DownButtonComponent);
    return DownButtonComponent;
}());



/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditButtonComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var EditButtonComponent = (function () {
    function EditButtonComponent() {
    }
    EditButtonComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'edit-btn',
            template: __webpack_require__(63)
        })
    ], EditButtonComponent);
    return EditButtonComponent;
}());



/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TrashButtonComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var TrashButtonComponent = (function () {
    function TrashButtonComponent() {
    }
    TrashButtonComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'trash-btn',
            template: __webpack_require__(64)
        })
    ], TrashButtonComponent);
    return TrashButtonComponent;
}());



/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UpButtonComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var UpButtonComponent = (function () {
    function UpButtonComponent() {
    }
    UpButtonComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'up-btn',
            template: __webpack_require__(65)
        })
    ], UpButtonComponent);
    return UpButtonComponent;
}());



/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FooterComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var FooterComponent = (function () {
    function FooterComponent() {
        this.title1 = "Address";
        this.title2 = "Social networks";
        this.title3 = "Contacts";
        this.city = "г. Одесса";
        this.street = "ул. Проспект Шевченко, 1ф";
        this.zipCode = "65000";
        this.vk_url = "https://vk.com";
        this.fb_url = "https://facebook.com";
        this.tg_url = "https://telegram.org";
        this.tw_url = "https://twitter.com";
        this.gp_url = "https://plus.google.com";
        this.vk_icon = 'assets//icons//vk.svg';
        this.fb_icon = 'assets//icons//fb.svg';
        this.tg_icon = 'assets//icons//tg.svg';
        this.tw_icon = 'assets//icons//tw.svg';
        this.gp_icon = 'assets//icons//gp.svg';
        this.phoneNumber = "+380123456789";
        this.email = "papa_peja322@opu.ua";
        this.skype = "solovyov909";
        this.whatsApp = "+380123456789";
        this.tech = "Created by SoBa";
        this.backgroundColorClass = "material-footer";
    }
    FooterComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'my-footer',
            styles: [__webpack_require__(90)],
            template: __webpack_require__(66)
        })
    ], FooterComponent);
    return FooterComponent;
}());



/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GalleryComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var GalleryComponent = (function () {
    function GalleryComponent() {
        this.model = {
            title: 'Галерея продуктов',
            backgroundColor: 'material-blue',
            ImgUrl1: 'Images//BA.jpg',
            ImgUrl2: 'Images//SO.jpg',
            ImgUrl3: 'Images//SO.jpg',
            description1: 'BA text about project',
            description2: 'SO text about project',
            description3: 'SoBa text about project'
        };
    }
    GalleryComponent.prototype.getBackgroundColor = function () {
        return this.model.backgroundColor;
    };
    GalleryComponent.prototype.ngOnInit = function () {
        if (this._page) {
            var details = JSON.parse(this._page.details);
            this.model.title = details.title;
            this.model.backgroundColor = details.backgroundColor;
            this.model.ImgUrl1 = details.imgUrl1;
            this.model.ImgUrl2 = details.imgUrl2;
            this.model.ImgUrl3 = details.imgUrl3;
            this.model.description1 = details.description1;
            this.model.description2 = details.description2;
            this.model.description3 = details.description3;
        }
    };
    GalleryComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'my-gallery',
            styles: [__webpack_require__(91)],
            template: __webpack_require__(67)
        })
    ], GalleryComponent);
    return GalleryComponent;
}());



/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var LoginComponent = (function () {
    function LoginComponent() {
    }
    LoginComponent.prototype.doLogin = function (ev) {
        //some login actions
    };
    LoginComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'login',
            styles: [__webpack_require__(92)],
            template: __webpack_require__(68)
        })
    ], LoginComponent);
    return LoginComponent;
}());



/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NavMenuComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var NavMenuComponent = (function () {
    function NavMenuComponent() {
    }
    NavMenuComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'nav-menu',
            template: __webpack_require__(69),
            styles: [__webpack_require__(93)]
        })
    ], NavMenuComponent);
    return NavMenuComponent;
}());



/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PersonComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var PersonComponent = (function () {
    function PersonComponent() {
        this.model = {
            title: 'Вердикт',
            backgroundColor: 'material-indigo',
            personImgUrl: 'Images//SO.jpg',
            opinion: 'Persona 5 — пожалуй, лучшая часть не только в серии Persona, но и в серии Shin Megami Tensei в целом. И одна из основных претенденток на игру года, сколь бы нишевой она ни казалась. Абсолютный must have для любителей жанра.',
            Name: 'Папа',
            Surname: 'Пежа',
            Age: '69',
            Occupation: 'Папа Пежа'
        };
    }
    PersonComponent.prototype.getBackgroundColor = function () {
        return this.model.backgroundColor;
    };
    PersonComponent.prototype.ngOnInit = function () {
        if (this._page) {
            var details = JSON.parse(this._page.details);
            this.model.title = details.title;
            this.model.backgroundColor = details.backgroundColor;
            this.model.personImgUrl = details.personImgUrl;
            this.model.opinion = details.opinion;
            this.model.Name = details.name;
            this.model.Surname = details.surname;
            this.model.Age = details.age;
            this.model.Occupation = details.occupation;
        }
    };
    PersonComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'my-person',
            styles: [__webpack_require__(94)],
            template: __webpack_require__(70)
        })
    ], PersonComponent);
    return PersonComponent;
}());



/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProductComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ProductComponent = (function () {
    function ProductComponent() {
        this.model = {
            title: "Денчик",
            backgroundColor: "material-red",
            productImgUrl: "Images//BA.jpg",
            mainText: "Persona 5 — пожалуй, лучшая часть не только в серии Persona, но и в серии Shin Megami Tensei в целом. И одна из основных претенденток на игру года, сколь бы нишевой она ни казалась. Абсолютный must have для любителей жанра.",
            subText: "Persona 5 — пожалуй, лучшая часть не только в серии Persona, но и в серии Shin Megami Tensei в целом. И одна из основных претенденток на игру года, сколь бы нишевой она ни казалась. Абсолютный must have для любителей жанра."
        };
    }
    ProductComponent.prototype.getBackgroundColor = function () {
        return this.model.backgroundColor;
    };
    ProductComponent.prototype.ngOnInit = function () {
        if (this._page) {
            var details = JSON.parse(this._page.details);
            this.model.title = details.title;
            this.model.backgroundColor = details.backgroundColor;
            this.model.productImgUrl = details.productImgUrl;
            this.model.mainText = details.mainText;
            this.model.subText = details.subText;
        }
    };
    ProductComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'my-product',
            styles: [__webpack_require__(95)],
            template: __webpack_require__(71)
        })
    ], ProductComponent);
    return ProductComponent;
}());



/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SearchableComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var SearchableComponent = (function () {
    function SearchableComponent() {
    }
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], SearchableComponent.prototype, "previewLink", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], SearchableComponent.prototype, "componentTitle", void 0);
    SearchableComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'searchable',
            template: __webpack_require__(72),
            styles: [__webpack_require__(96)],
        })
    ], SearchableComponent);
    return SearchableComponent;
}());



/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GallerySidebarComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(3);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var GallerySidebarComponent = (function () {
    function GallerySidebarComponent() {
        this.model = {
            title: '',
            backgroundColor: '',
            imgUrl1: '',
            imgUrl2: '',
            imgUrl3: '',
            description1: '',
            description2: '',
            description3: ''
        };
    }
    //инициализация формы
    GallerySidebarComponent.prototype.ngOnInit = function () {
        this.galleryEditForm = new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormGroup"]({
            title: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            backgroundColor: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            imgUrl1: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            imgUrl2: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            imgUrl3: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            description1: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            description2: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            description3: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
        });
    };
    GallerySidebarComponent.prototype.updateImage = function (ev, index) {
        var file = ev.target.files[0];
        switch (index) {
            case 1:
                this.model.imgUrl1 = file.name;
                this.imgFile1 = file;
                break;
            case 2:
                this.model.imgUrl2 = file.name;
                this.imgFile2 = file;
                break;
            case 3:
                this.model.imgUrl3 = file.name;
                this.imgFile3 = file;
                break;
        }
    };
    GallerySidebarComponent.prototype.save = function (data) {
        //данные об изображении передаются в модель в updateImage()
        this.model.title = data.title;
        this.model.description1 = data.description1;
        this.model.description2 = data.description2;
        this.model.description3 = data.description3;
        this.model.backgroundColor = data.backgroundColor;
        //ready to be sent to server
        var details = JSON.stringify(this.model);
        console.log(details);
        var output = new FormData();
        output.append('details', details);
        if (this.imgFile1) {
            output.append('uploads', this.imgFile1);
        }
        if (this.imgFile2) {
            output.append('uploads', this.imgFile2);
        }
        if (this.imgFile3) {
            output.append('uploads', this.imgFile3);
        }
    };
    GallerySidebarComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'my-gallerysidebar',
            template: __webpack_require__(73)
        })
    ], GallerySidebarComponent);
    return GallerySidebarComponent;
}());



/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PersonSidebarComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(3);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var PersonSidebarComponent = (function () {
    function PersonSidebarComponent() {
        this.model = {
            title: '',
            mainText: '',
            personName: '',
            age: 0,
            position: '',
            photo: '',
            backgroundColor: ''
        };
    }
    //инициализация формы
    PersonSidebarComponent.prototype.ngOnInit = function () {
        this.personEditForm = new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormGroup"]({
            title: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            backgroundColor: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            mainText: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            personName: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            age: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"](0, [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            position: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            photo: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required])
        });
    };
    PersonSidebarComponent.prototype.updateImage = function (ev) {
        var file = ev.target.files[0];
        this.model.photo = file.name;
        this.imageFile = file;
    };
    PersonSidebarComponent.prototype.save = function (data) {
        //данные об изображении передаются в модель в updateImage()
        this.model.title = data.title;
        this.model.mainText = data.mainText;
        this.model.personName = data.personName;
        this.model.position = data.position;
        this.model.age = data.age;
        this.model.backgroundColor = data.backgroundColor;
        //ready to be sent to server
        var details = JSON.stringify(this.model);
        console.log(details);
        var output = new FormData();
        output.append('details', details);
        output.append('uploads', this.imageFile);
    };
    PersonSidebarComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'my-personsidebar',
            template: __webpack_require__(74)
        })
    ], PersonSidebarComponent);
    return PersonSidebarComponent;
}());



/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProductSidebarComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(3);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var ProductSidebarComponent = (function () {
    function ProductSidebarComponent() {
        this.model = {
            title: '',
            mainText: '',
            subText: '',
            photo: '',
            backgroundColor: ''
        };
    }
    //инициализация формы
    ProductSidebarComponent.prototype.ngOnInit = function () {
        this.productEditForm = new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormGroup"]({
            title: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            mainText: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            subText: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            photo: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            backgroundColor: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required])
        });
    };
    ProductSidebarComponent.prototype.updateImage = function (ev) {
        var file = ev.target.files[0];
        this.model.photo = file.name;
        this.imageFile = file;
    };
    ProductSidebarComponent.prototype.save = function (data) {
        //данные об изображении передаются в модель в updateImage()
        this.model.title = data.title;
        this.model.mainText = data.mainText;
        this.model.subText = data.subText;
        this.model.backgroundColor = data.backgroundColor;
        //ready to be sent to server
        var details = JSON.stringify(this.model);
        console.log(details);
        ;
        var output = new FormData();
        output.append('details', details);
        output.append('uploads', this.imageFile);
    };
    ProductSidebarComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'my-productsidebar',
            template: __webpack_require__(75)
        })
    ], ProductSidebarComponent);
    return ProductSidebarComponent;
}());



/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SearchSidebarComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__page__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_page_service__ = __webpack_require__(5);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SearchSidebarComponent = (function () {
    function SearchSidebarComponent(pageService) {
        this.pageService = pageService;
    }
    SearchSidebarComponent.prototype.ngOnInit = function () {
        this.titles0 = 'Text component';
        this.previews0 = 'Images//previews//text.PNG';
        this.template0 = 'text-component';
        this.titles1 = 'Team component';
        this.previews1 = 'Images//previews//team.PNG';
        this.template1 = 'team-component';
        this.titles2 = 'Person component';
        this.previews2 = 'Images//previews//person.PNG';
        this.template2 = 'person-component';
        this.titles3 = 'Product component';
        this.previews3 = 'Images//previews//product.PNG';
        this.template3 = 'product-component';
        this.titles4 = 'Gallery component';
        this.previews4 = 'Images//previews//gallery.PNG';
        this.template4 = 'gallery-component';
        this.textDetails = {
            title: 'TextTitle',
            mainText: 'MainText',
            subText: 'SubText',
            backgroundColor: '#ffffff',
            buttonLeftText: 'leftText',
            buttonRightText: 'rightText',
            buttonLeftLink: 'http://localhost/leftlink',
            buttonRightLink: 'http://localhost/rightlink'
        };
        this.teamDetails = {
            title: 'TeamTitle',
            mainText: 'MainText',
            backgroundColor: '#ffffff',
            teammate1_Name: 'DummyName1',
            teammate1_Description: 'DummyDescription1',
            teammate1_Link: 'https://localhost/firstLink',
            teammate1_Photo: 'Images//dummy6.png',
            teammate2_Name: 'DummyName2',
            teammate2_Description: 'DummyDescription2',
            teammate2_Link: 'https://localhost/secondLink',
            teammate2_Photo: 'Images//dummy7.png',
        };
        this.productDetails = {
            title: 'ProductTitle',
            mainText: 'MainText',
            subText: 'SubText',
            photo: 'Images//dummy5.png',
            backgroundColor: '#ffffff'
        };
        this.personDetails = {
            title: 'PersonTitle',
            mainText: 'MainText',
            personName: 'DummyName',
            age: '1337',
            position: 'PersonPosition',
            photo: 'Images//dummy4.png',
            backgroundColor: '#ffffff'
        };
        this.galleryDetails = {
            title: 'GalleryTitle',
            backgroundColor: '#ffffff',
            imgUrl1: 'Images//dummy1.png',
            imgUrl2: 'Images//dummy1.png',
            imgUrl3: 'Images//dummy1.png',
            description1: 'Dummy description to project1',
            description2: 'Dummy description to project2',
            description3: 'Dummy description to project3'
        };
    };
    SearchSidebarComponent.prototype.createPage = function (template) {
        var position = this.pageService.getPages.length + 1;
        var objId = position;
        var details = '';
        switch (template) {
            case 'text-component':
                details = this.textDetails;
                break;
            case 'team-component':
                details = this.teamDetails;
                break;
            case 'person-component':
                details = this.productDetails;
                break;
            case 'product-component':
                details = this.personDetails;
                break;
            case 'gallery-component':
                details = this.galleryDetails;
                break;
        }
        var page = new __WEBPACK_IMPORTED_MODULE_1__page__["a" /* Page */](objId, position, template, JSON.stringify(details));
        this.pageService.addPage(page);
    };
    SearchSidebarComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'my-searchsidebar',
            template: __webpack_require__(76),
            providers: [__WEBPACK_IMPORTED_MODULE_2__services_page_service__["a" /* PageService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__services_page_service__["a" /* PageService */]])
    ], SearchSidebarComponent);
    return SearchSidebarComponent;
}());



/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TeamSidebarComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(3);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var TeamSidebarComponent = (function () {
    function TeamSidebarComponent() {
        this.model = {
            title: '',
            mainText: '',
            backgroundColor: '',
            teammate1_Name: '',
            teammate1_Description: '',
            teammate1_Link: '',
            teammate1_Photo: '',
            teammate2_Name: '',
            teammate2_Description: '',
            teammate2_Link: '',
            teammate2_Photo: '',
        };
    }
    //инициализация формы
    TeamSidebarComponent.prototype.ngOnInit = function () {
        this.teamEditForm = new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormGroup"]({
            title: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            mainText: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            backgroundColor: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            teammate1_Name: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            teammate1_Description: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            teammate1_Link: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            teammate1_Photo: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            teammate2_Name: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            teammate2_Description: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            teammate2_Link: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            teammate2_Photo: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
        });
    };
    TeamSidebarComponent.prototype.updateImage = function (ev, index) {
        var file = ev.target.files[0];
        switch (index) {
            case 1:
                this.model.teammate1_Photo = file.name;
                this.imgFile1 = file;
                break;
            case 2:
                this.model.teammate2_Photo = file.name;
                this.imgFile2 = file;
                break;
        }
    };
    TeamSidebarComponent.prototype.save = function (data) {
        //данные об изображении передаются в модель в updateImage()
        this.model.title = data.title;
        this.model.mainText = data.mainText;
        this.model.backgroundColor = data.backgroundColor;
        this.model.teammate1_Name = data.teammate1_Name;
        this.model.teammate1_Description = data.teammate1_Description;
        this.model.teammate1_Link = data.teammate1_Link;
        this.model.teammate2_Name = data.teammate2_Name;
        this.model.teammate2_Description = data.teammate2_Description;
        this.model.teammate2_Link = data.teammate2_Link;
        //ready to be sent to server
        var details = JSON.stringify(this.model);
        console.log(details);
        var output = new FormData();
        output.append('details', details);
        if (this.imgFile1) {
            output.append('uploads', this.imgFile1);
        }
        if (this.imgFile2) {
            output.append('uploads', this.imgFile2);
        }
    };
    TeamSidebarComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'my-teamsidebar',
            template: __webpack_require__(77)
        })
    ], TeamSidebarComponent);
    return TeamSidebarComponent;
}());



/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TextSidebarComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(3);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var TextSidebarComponent = (function () {
    function TextSidebarComponent() {
        this.model = {
            title: '',
            mainText: '',
            subText: '',
            backgroundColor: '',
            buttonLeftLink: '',
            buttonRightLink: '',
            buttonLeftText: '',
            buttonRightText: ''
        };
    }
    //инициализация формы
    TextSidebarComponent.prototype.ngOnInit = function () {
        this.textEditForm = new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormGroup"]({
            title: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            mainText: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            subText: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            backgroundColor: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            buttonLeftLink: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            buttonRightLink: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            buttonLeftText: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]),
            buttonRightText: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required])
        });
    };
    TextSidebarComponent.prototype.save = function (data) {
        this.model = data;
        //ready to be sent to server
        var details = JSON.stringify(this.model);
        console.log(details);
        var output = new FormData();
        output.append('details', details);
    };
    TextSidebarComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'my-textsidebar',
            template: __webpack_require__(78)
        })
    ], TextSidebarComponent);
    return TextSidebarComponent;
}());



/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TeamComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var TeamComponent = (function () {
    function TeamComponent() {
        this.model = {
            title: "Oi, mates!",
            mainText: "Компания CоБа динамично развивается и растет с каждым годом. Сейчас в нашей семье работает около 1.75 квалифицированных разработчика. Ежеквартально все сотрудники компании проходят обязательную аттестацию для подтверждения или повышения своего квалификационного уровня, что также обеспечивает им карьерный рост и развитие. Мы активно работаем над совершенствованием наших коммуникативных, языковых и профессиональных навыков для обеспечения качественной обратной связи и взаимопонимания с клиентами. Большинство наших сотрудников владеют английским языком на высоком уровне. Мы любим персональное общение с клиентами и не только о работе! Двери компании СоБа всегда открыты для наших клиентов и гостей. Мы рады новым знакомствам и встречам. Приглашаем и вас познакомиться поближе с нашей командой!",
            backgroundColor: "material-orange",
            stName: 'Ilya Solovyov',
            stPhoto: 'Images//SO.jpg',
            stDesc: 'make oXXXymiron great again...',
            stLink: 'https://github.com/IlyaSolovyov',
            ndName: 'Baghin Denis',
            ndPhoto: 'Images//BA.jpg',
            ndDesc: 'make ui in luxoft...',
            ndLink: 'https://github.com/Denis1697'
        };
    }
    TeamComponent.prototype.getBackgroundColor = function () {
        return this.model.backgroundColor;
    };
    TeamComponent.prototype.ngOnInit = function () {
        if (this._page) {
            var details = JSON.parse(this._page.details);
            this.model.title = details.title;
            this.model.backgroundColor = details.backgroundColor;
            this.model.stName = details.stName;
            this.model.stPhoto = details.stPhoto;
            this.model.stDesc = details.stDesc;
            this.model.stLink = details.stLink;
            this.model.ndName = details.ndName;
            this.model.ndPhoto = details.ndPhoto;
            this.model.ndDesc = details.ndDesc;
            this.model.ndLink = details.ndLink;
        }
    };
    TeamComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'my-team',
            styles: [__webpack_require__(97)],
            template: __webpack_require__(79)
        })
    ], TeamComponent);
    return TeamComponent;
}());



/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TeammateComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var TeammateComponent = (function () {
    function TeammateComponent() {
    }
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], TeammateComponent.prototype, "name", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], TeammateComponent.prototype, "photo", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], TeammateComponent.prototype, "description", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], TeammateComponent.prototype, "profileLink", void 0);
    TeammateComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'teammate',
            styles: [__webpack_require__(98)],
            template: __webpack_require__(80)
        })
    ], TeammateComponent);
    return TeammateComponent;
}());



/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TextComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var TextComponent = (function () {
    function TextComponent() {
        this.model = {
            title: "Some text theme",
            mainText: "Проснувшись однажды утром после беспокойного сна, Грегор Замза обнаружил, что он у себя в постели превратился в страшное насекомое. Лежа на панцирнотвердой спине, он видел, стоило ему приподнять голову, свой коричневый, выпуклый, разделенный дугообразными чешуйками живот, на верхушке которого еле держалось готовое вот-вот окончательно сползти одеяло. Его многочисленные, убого тонкие по сравнению с остальным телом ножки беспомощно копошились у него перед глазами. «Что со мной случилось?» – подумал он. Это не было сном. Его комната, настоящая, разве что слишком маленькая, но обычная комната, мирно покоилась в своих четырех хорошо знакомых стенах. Над столом, где были разложены распакованные образцы сукон – Замза был коммивояжером, – висел портрет, который он недавно вырезал из иллюстрированного журнала и вставил в красивую золоченую рамку. На портрете была изображена дама в меховой шляпе и боа, она сидела очень прямо и протягивала зрителю тяжелую меховую муфту, в которой целиком исчезала ее рука. Затем взгляд Грегора устремился в окно, и пасмурная погода – слышно было, как по жести подоконника стучат капли дождя – привела его и вовсе в грустное настроение. «Хорошо бы еще немного поспать и забыть всю эту чепуху», – подумал он, но это было совершенно неосуществимо, он привык спать на правом боку, а в теперешнем своем",
            subText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            buttonLeftText: "coolsite!",
            buttonRightText: "meh...",
            buttonLeftLink: "https://www.pornhub.com",
            buttonRightLink: "http://opu.ua",
            backgroundColor: "material-blue"
        };
    }
    TextComponent.prototype.getBackgroundColor = function () {
        return this.model.backgroundColor;
    };
    TextComponent.prototype.ngOnInit = function () {
        if (this._page) {
            var details = JSON.parse(this._page.details);
            this.model.title = details.title;
            this.model.backgroundColor = details.backgroundColor;
            this.model.mainText = details.mainText;
            this.model.subText = details.subText;
            this.model.buttonLeftText = details.buttonLeftText;
            this.model.buttonLeftLink = details.buttonLeftLink;
            this.model.buttonRightText = details.buttonRightText;
            this.model.buttonRightLink = details.buttonRightLink;
        }
    };
    TextComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'my-text',
            styles: [__webpack_require__(99)],
            template: __webpack_require__(81)
        })
    ], TextComponent);
    return TextComponent;
}());



/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DevButtonComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var DevButtonComponent = (function () {
    function DevButtonComponent() {
    }
    DevButtonComponent.prototype.onScroll = function () {
        var devButton = document.getElementById("devButton");
        if (devButton != null) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                devButton.classList.remove("hidden-devBtn");
                devButton.classList.add("visible-devBtn");
            }
            else {
                devButton.classList.remove("visible-devBtn");
                devButton.classList.add("hidden-devBtn");
            }
        }
    };
    DevButtonComponent.prototype.testClick = function () {
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"])("window:scroll", []),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], DevButtonComponent.prototype, "onScroll", null);
    DevButtonComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'devbutton',
            styles: [__webpack_require__(100)],
            template: __webpack_require__(82)
        })
    ], DevButtonComponent);
    return DevButtonComponent;
}());



/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FabComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var FabComponent = (function () {
    function FabComponent() {
        this.backgroundIcon = "/assets/icons/plus.svg";
    }
    FabComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'my-fab',
            styles: [__webpack_require__(101)],
            template: __webpack_require__(83)
        })
    ], FabComponent);
    return FabComponent;
}());



/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AccountService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AccountService = (function () {
    function AccountService(http) {
        this.http = http;
    }
    AccountService.prototype.authenticate = function (password) {
        var body = "username=" + password;
        var headers = new Headers();
        headers.append('Content-Type', 'multipart/form-data');
        /*this.http
                .post('localhost:57092/api/page', body, { headers: headers })
                .map(response => response.json())
                    .subscribe(
                    response => this.storeToken(response.id_token),
                    this.logError,
                    () => console.log('Authentication Complete')
                   );
        */
    };
    AccountService.prototype.updatePage = function () {
    };
    AccountService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["Http"]])
    ], AccountService);
    return AccountService;
}());



/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, "\r\n@media (max-width: 767px) {\r\n    /* On small screens, the nav menu spans the full width of the screen. Leave a space for it. */\r\n    .body-content {\r\n        padding-top: 50px;\r\n    }\r\n}\r\n", ""]);

// exports


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".footer-component {\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: flex-start;\r\n    align-content: center;\r\n    padding: 20px;\r\n}\r\n\r\n.social-icons a img {\r\n    width: 32px;\r\n    height: 32px;\r\n    filter: invert(0%);\r\n    transition: filter linear 0.2s;\r\n}\r\n\r\n.social-icons a img:hover {\r\n    filter: invert(100%);\r\n}\r\n\r\n.publicy {\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: space-around;\r\n    align-items: flex-start;\r\n}\r\n\r\n.address, \r\n.contact {\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n    align-items: flex-start;\r\n}\r\n\r\n.footer-cont-item {\r\n    padding: 5px 0;\r\n    font-family: Unineue-Light;\r\n    font-size: 16px;\r\n}\r\n\r\n.social-icons {\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: space-around;\r\n    align-items: stretch;\r\n}\r\n\r\n.technical-info {\r\n    display: flex;\r\n    justify-content: center;\r\n}", ""]);

// exports


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".masonry--h, .masonry--v {\r\n    margin-left: -8px;\r\n    counter-reset: brick;\r\n}\r\n\r\n.masonry {\r\n    display: flex;\r\n    flex-flow: row wrap;\r\n    margin-left: -8px; /* Adjustment for the gutter */\r\n}\r\n.masonry-brick {\r\n    flex: auto;\r\n    height: 250px;\r\n    min-width: 150px;\r\n    margin: 0 8px 8px 0; /* Some gutter */\r\n    background-color: #333;\r\n    color: white;\r\n    position: relative;\r\n}\r\n\r\n.masonry-brick:nth-child(4n+1) {\r\n    width: 250px;\r\n}\r\n.masonry-brick:nth-child(4n+2) {\r\n    width: 325px;\r\n}\r\n.masonry-brick:nth-child(4n+3) {\r\n    width: 180px;\r\n}\r\n.masonry-brick:nth-child(4n+4) {\r\n    width: 380px;\r\n}\r\n\r\n.masonry-img {\r\n    object-fit: cover;\r\n    width: 100%;\r\n    height: 100%;\r\n    transition: 0.4s transform ease;\r\n}\r\n\r\n.product-gallery-text:active ~ .masonry-img {\r\n    transform: scale(1.25, 1.25);\r\n    -webkit-transform: scale(1.25, 1.25);\r\n    -moz-transform: scale(1.25, 1.25);\r\n    -o-transform: scale(1.25, 1.25);\r\n    -ms-transform: scale(1.25, 1.25);\r\n    z-index: 3;\r\n}\r\n\r\n.product-gallery-text {\r\n    position: absolute;\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    top: 0;\r\n    bottom: 0;\r\n    left: 0;\r\n    right: 0;\r\n    filter: brightness(100%);\r\n    transition: 0.4s background-color ease, 0.4s transform ease;\r\n    transform: scale(1, 1);\r\n    -webkit-transform: scale(1, 1);\r\n    -moz-transform: scale(1, 1);\r\n    -o-transform: scale(1, 1);\r\n    -ms-transform: scale(1, 1);\r\n    background-color: rgba(255, 255, 255, 0.0);\r\n    z-index: 1;\r\n}\r\n\r\n.product-gallery-text:hover {\r\n    background-color: rgba(0,0,0,0.5);\r\n    cursor: pointer;\r\n}\r\n\r\n.product-gallery-text p {\r\n    color: white;\r\n    font-size: 28px;\r\n    opacity: 0;\r\n    transition: 0.7s opacity ease;\r\n    text-align: center;\r\n}\r\n\r\n.product-gallery-text:hover p {\r\n    opacity: 1.0;\r\n}\r\n\r\n.product-gallery-text:active {\r\n    transform: scale(1.25, 1.25);\r\n    -webkit-transform: scale(1.25, 1.25);\r\n    -moz-transform: scale(1.25, 1.25);\r\n    -o-transform: scale(1.25, 1.25);\r\n    -ms-transform: scale(1.25, 1.25);\r\n    z-index: 4;\r\n}", ""]);

// exports


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".form {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    position: fixed;\r\n    width: 400px;\r\n    height: 155px;\r\n    left: calc(50% - 200px);\r\n    top: calc(50% - 106px);\r\n    background: #edeff1;\r\n    margin: 0px auto;\r\n    padding-top: 20px;\r\n    border-radius: 10px;\r\n    -moz-border-radius: 10px;\r\n    -webkit-border-radius: 10px;\r\n    z-index: 7;\r\n\r\n    transition: 0.5s transform ease;\r\n\r\n    -webkit-box-shadow: 4px 10px 36px 1px rgba(0,0,0,0.75);\r\n    -moz-box-shadow: 4px 10px 36px 1px rgba(0,0,0,0.75);\r\n    box-shadow: 4px 10px 36px 1px rgba(0,0,0,0.75);\r\n}\r\n\r\n.form a {\r\n    text-align: center;\r\n}\r\n\r\ninput[type=\"text\"] {\r\n    display: block;\r\n    width: 309px;\r\n    height: 35px;\r\n    margin: 15px auto;\r\n    background: #fff;\r\n    border: 0px;\r\n    padding: 5px;\r\n    font-size: 16px;\r\n    border: 2px solid #fff;\r\n    transition: all 0.3s ease;\r\n    border-radius: 5px;\r\n    -moz-border-radius: 5px;\r\n    -webkit-border-radius: 5px;\r\n}\r\n\r\ninput[type=\"text\"]:focus {\r\n    border: 2px solid #1abc9d\r\n}\r\n\r\ninput[type=\"submit\"] {\r\n    width: 314px;\r\n    height: 40px;\r\n    padding: 12px;\r\n    cursor: pointer;\r\n    margin: auto;\r\n    font-size: 17px;\r\n    transition: all 0.3s ease;\r\n}\r\n\r\na {\r\n    transition: all 0.3s ease;\r\n}\r\n\r\n::-webkit-input-placeholder {\r\n    color: gray;\r\n}\r\n\r\n:-moz-placeholder { /* Firefox 18- */\r\n    color: gray;\r\n}\r\n\r\n::-moz-placeholder { /* Firefox 19+ */\r\n    color: gray;\r\n}\r\n\r\n:-ms-input-placeholder {\r\n    color: gray;\r\n}\r\n\r\n.closeWindow {\r\n    position: absolute;\r\n    width: 32px;\r\n    height: 32px;\r\n    top: -15px;\r\n    right: -37px;\r\n    background-image: url(" + __webpack_require__(102) + ");\r\n    background-repeat: round;\r\n    cursor: pointer;\r\n    transition: 0.2s transform ;\r\n}\r\n\r\n.closeWindow:hover {\r\n    transform: scale(1.25, 1.25);\r\n}\r\n\r\n#showSignIn:not(:checked) ~ .form {\r\n    transform: translateY(-100vh);\r\n}\r\n\r\n#showSignIn:checked ~ .form {\r\n    transform: translateY(0);\r\n}\r\n", ""]);

// exports


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, "li .glyphicon {\r\n    margin-right: 10px;\r\n}\r\n\r\n/* Highlighting rules for nav menu items */\r\nli.link-active a,\r\nli.link-active a:hover,\r\nli.link-active a:focus {\r\n    background-color: #4189C7;\r\n    color: white;\r\n}\r\n\r\n/* Keep the nav menu independent of scrolling and on top of other items */\r\n.main-nav {\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    z-index: 1;\r\n}\r\n\r\n@media (min-width: 768px) {\r\n    /* On small screens, convert the nav menu to a vertical sidebar */\r\n    .main-nav {\r\n        height: 100%;\r\n        width: calc(25% - 20px);\r\n    }\r\n    .navbar {\r\n        border-radius: 0px;\r\n        border-width: 0px;\r\n        height: 100%;\r\n    }\r\n    .navbar-header {\r\n        float: none;\r\n    }\r\n    .navbar-collapse {\r\n        border-top: 1px solid #444;\r\n        padding: 0px;\r\n    }\r\n    .navbar ul {\r\n        float: none;\r\n    }\r\n    .navbar li {\r\n        float: none;\r\n        font-size: 15px;\r\n        margin: 6px;\r\n    }\r\n    .navbar li a {\r\n        padding: 10px 16px;\r\n        border-radius: 4px;\r\n    }\r\n    .navbar a {\r\n        /* If a menu item's text is too long, truncate it */\r\n        width: 100%;\r\n        white-space: nowrap;\r\n        overflow: hidden;\r\n        text-overflow: ellipsis;\r\n    }\r\n}\r\n", ""]);

// exports


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".person-component {\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: center;\r\n    align-items: stretch;\r\n    margin: auto;\r\n}\r\n\r\n.person-photo,\r\n.person-component-content {\r\n    width: 45%;\r\n}\r\n\r\n.person-component-content {\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n}\r\n\r\n.person-photo {\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    padding: 6%;\r\n}\r\n\r\n.person-photo img {\r\n    width: 100%;\r\n    height: 100%;\r\n    cursor: pointer;\r\n    box-shadow: 0;\r\n    transition: box-shadow 0.4s ease, border-radius 0.4s ease;\r\n    -webkit-border-radius: 30px;\r\n    -moz-border-radius: 30px;\r\n    border-radius: 30px;\r\n}\r\n\r\n.person-photo img:hover {\r\n    -webkit-box-shadow: 0px 2px 77px -9px rgba(184,180,184,1);\r\n    -moz-box-shadow: 0px 2px 77px -9px rgba(184,180,184,1);\r\n    box-shadow: 0px 2px 77px -9px rgba(184,180,184,1);\r\n    -webkit-border-radius: 50px;\r\n    -moz-border-radius: 50px;\r\n    border-radius: 50px;\r\n}\r\n\r\n.person-component-title,\r\n.person-component-opinion {\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n    align-items: flex-start;\r\n}\r\n\r\n.person-info {\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n    align-items: flex-end;\r\n}\r\n\r\n.person-component-opinion,\r\n.person-info {\r\n    width: 100%;\r\n}\r\n\r\n.person-name {\r\n    display: flex;\r\n    flex-direction: row;\r\n}", ""]);

// exports


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".product-component {\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: center;\r\n    align-items: center;\r\n}\r\n\r\n.product-demo img {\r\n    width: 100%;\r\n    height: 100%;\r\n    cursor: pointer;\r\n    box-shadow: 0;\r\n    transition: box-shadow 0.4s ease, border-radius 0.4s ease;\r\n    -webkit-border-radius: 30px;\r\n    -moz-border-radius: 30px;\r\n    border-radius: 30px;\r\n}\r\n\r\n.product-demo img:hover {\r\n    -webkit-box-shadow: 0px 2px 77px -9px rgba(184,180,184,1);\r\n    -moz-box-shadow: 0px 2px 77px -9px rgba(184,180,184,1);\r\n    box-shadow: 0px 2px 77px -9px rgba(184,180,184,1);\r\n    -webkit-border-radius: 50px;\r\n    -moz-border-radius: 50px;\r\n    border-radius: 50px;\r\n}\r\n\r\n.product-component {\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: center;\r\n    align-items: stretch;\r\n    margin: auto;\r\n}\r\n\r\n.product-component < article {\r\n    width: 100%;\r\n}\r\n\r\n.product-demo,\r\n.product-component-content {\r\n    width: 45%;\r\n}\r\n\r\n.product-component-content {\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n}\r\n\r\n.product-demo{\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    padding: 6%;\r\n}\r\n\r\n.product-component-title,\r\n.product-component-content.main-text, \r\n.product-component-content.sub-text {\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n    align-items: flex-start;\r\n}\r\n\r\n.product-component-content.main-text,\r\n.product-component-content.sub-text {\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n    align-items: flex-end;\r\n}\r\n\r\n.product-component-content.main-text,\r\n.product-component-content.sub-text {\r\n    width: 100%;\r\n}", ""]);

// exports


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".searchable-block {\r\n    display: flex;\r\n    justify-content: center;\r\n\r\n    height: 150px;\r\n    cursor: pointer;\r\n\r\n    transition: 0.2s transform, 0.2s filter;\r\n}\r\n\r\n.searchable-block img {\r\n    width: 150px;\r\n    height: 100px;\r\n}\r\n\r\n.searchable-block:hover {\r\n    transform: scale(1.1, 1.1);\r\n    filter: brightness(50%);\r\n}\r\n\r\n.searchable-block:active {\r\n    transform: scale(1.3, 1.3);\r\n}\r\n\r\n.comp-h2 {\r\n    margin: 0;\r\n}", ""]);

// exports


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".team-component-content {\r\n    text-align: justify;\r\n}\r\n", ""]);

// exports


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".text-component-content {\r\n    margin: 20px 0;\r\n}", ""]);

// exports


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".hidden-devBtn {\r\n    transform: translateY(100px);\r\n}\r\n\r\n.visible-devBtn {\r\n    transform: translateY(20px);\r\n}\r\n\r\n.developerButton {\r\n    position: fixed;\r\n    bottom: 0;\r\n    z-index: 7;\r\n    transition: 0.2s transform ease;\r\n}", ""]);

// exports


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".fab {\r\n    position: fixed;\r\n    width: 56px;\r\n    left: 95%;\r\n    bottom: 15px;\r\n    margin-left: -28px;\r\n    cursor: pointer;\r\n    z-index: 5;\r\n    transition: all 0.3s;\r\n}\r\n\r\n.fab:active {\r\n    filter: brightness(50%);\r\n}\r\n\r\n.fab:hover .fab-buttons {\r\n    opacity: 1;\r\n    visibility: visible;\r\n}\r\n\r\n.fab:hover .fab-buttons__link {\r\n    transform: scaleY(1) scaleX(1) translateY(-16px) translateX(0px);\r\n}\r\n\r\n.fab-action-button:hover + .fab-buttons .fab-buttons__link:before {\r\n    visibility: visible;\r\n    opacity: 1;\r\n    transform: scale(1);\r\n    transform-origin: right center 0;\r\n    transition-delay: 0.3s;\r\n}\r\n\r\n.fab-action-button {\r\n    position: absolute;\r\n    bottom: 0;\r\n    display: block;\r\n    width: 56px;\r\n    height: 56px;\r\n    background-color: #f6293c;\r\n    border-radius: 50%;\r\n    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);\r\n}\r\n\r\n.fab-buttons {\r\n    position: absolute;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 50px;\r\n    list-style: none;\r\n    margin: 0;\r\n    padding: 0;\r\n    opacity: 0;\r\n    visibility: hidden;\r\n    transition: 0.2s;\r\n}\r\n\r\n.fab-action-button__icon {\r\n    display: inline-block;\r\n    width: 56px;\r\n    height: 56px;\r\n    background: url(\"/assets/icons/plus.svg\") center no-repeat;\r\n}\r\n\r\n.fab-buttons__item {\r\n    display: block;\r\n    text-align: center;\r\n    margin: 12px 0;\r\n}\r\n\r\n.fab-buttons__link {\r\n    display: inline-block;\r\n    width: 40px;\r\n    height: 40px;\r\n    text-decoration: none;\r\n    background-color: #ffffff;\r\n    border-radius: 50%;\r\n    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);\r\n    transform: scaleY(0.5) scaleX(0.5) translateY(0px) translateX(0px);\r\n    -moz-transition: .3s;\r\n    -webkit-transition: .3s;\r\n    -o-transition: .3s;\r\n    transition: .3s;\r\n}\r\n\r\n[data-tooltip]:before {\r\n    top: 50%;\r\n    margin-top: -11px;\r\n    font-weight: 600;\r\n    border-radius: 2px;\r\n    background: #585858;\r\n    color: #fff;\r\n    content: attr(data-tooltip);\r\n    font-size: 12px;\r\n    text-decoration: none;\r\n    visibility: hidden;\r\n    opacity: 0;\r\n    padding: 4px 7px;\r\n    margin-right: 12px;\r\n    position: absolute;\r\n    transform: scale(0);\r\n    right: 100%;\r\n    white-space: nowrap;\r\n    transform-origin: top right;\r\n    transition: all .3s cubic-bezier(.25, .8, .25, 1);\r\n}\r\n\r\n[data-tooltip]:hover:before {\r\n    visibility: visible;\r\n    opacity: 1;\r\n    transform: scale(1);\r\n    transform-origin: right center 0;\r\n}\r\n\r\n.icon-material {\r\n    display: inline-block;\r\n    width: 40px;\r\n    height: 40px;\r\n}\r\n\r\n.icon-material_fb {\r\n    background: url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDUxMCA1MTAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMCA1MTA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0icG9zdC1mYWNlYm9vayI+CgkJPHBhdGggZD0iTTQ1OSwwSDUxQzIyLjk1LDAsMCwyMi45NSwwLDUxdjQwOGMwLDI4LjA1LDIyLjk1LDUxLDUxLDUxaDQwOGMyOC4wNSwwLDUxLTIyLjk1LDUxLTUxVjUxQzUxMCwyMi45NSw0ODcuMDUsMCw0NTksMHogICAgIE00MzMuNSw1MXY3Ni41aC01MWMtMTUuMywwLTI1LjUsMTAuMi0yNS41LDI1LjV2NTFoNzYuNXY3Ni41SDM1N1Y0NTloLTc2LjVWMjgwLjVoLTUxVjIwNGg1MXYtNjMuNzUgICAgQzI4MC41LDkxLjgsMzIxLjMsNTEsMzY5Ljc1LDUxSDQzMy41eiIgZmlsbD0iIzc1NzU3NSIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=\") center no-repeat;\r\n}\r\n\r\n.icon-material_gp {\r\n    background: url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDUxMCA1MTAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMCA1MTA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0icG9zdC1ncGx1cyI+CgkJPHBhdGggZD0iTTIzNC42LDE3NS45NWMwLTI1LjUtMTUuMy03Ni41LTUzLjU1LTc2LjVjLTE1LjMsMC0zMy4xNSwxMC4yLTMzLjE1LDQzLjM1YzAsMzAuNiwxNS4zLDczLjk1LDUxLDczLjk1ICAgIEMxOTguOSwyMTYuNzUsMjM0LjYsMjE0LjIsMjM0LjYsMTc1Ljk1eiBNMjE5LjMsMzAwLjljLTIuNTUsMC01LjEsMC03LjY1LDBsMCwwYy03LjY1LDAtMzAuNiwyLjU1LTQ1LjksNy42NDkgICAgQzE0Ny45LDMxMy42NSwxMjcuNSwzMjYuNCwxMjcuNSwzNTEuOWMwLDI4LjA1LDI1LjUsNTYuMSw3Ni41LDU2LjFjMzguMjUsMCw2MS4yLTI1LjUsNjEuMi01MSAgICBDMjY1LjIsMzM5LjE1LDI1Mi40NSwzMjYuNCwyMTkuMywzMDAuOXogTTQ1OSwwSDUxQzIyLjk1LDAsMCwyMi45NSwwLDUxdjQwOGMwLDI4LjA1LDIyLjk1LDUxLDUxLDUxaDQwOGMyOC4wNSwwLDUxLTIyLjk1LDUxLTUxICAgIFY1MUM1MTAsMjIuOTUsNDg3LjA1LDAsNDU5LDB6IE0xODEuMDUsNDM4LjZjLTcxLjQsMC0xMDQuNTUtNDAuOC0xMDQuNTUtNzYuNWMwLTEyLjc1LDIuNTUtNDAuOCwzOC4yNS02MS4xOTkgICAgYzIwLjQtMTIuNzUsNDUuOS0yMC40LDc5LjA1LTIyLjk1Yy01LjEtNS4xMDEtNy42NS0xMi43NS03LjY1LTI1LjVjMC01LjEsMC03LjY1LDIuNTUtMTIuNzVoLTEwLjJjLTUxLDAtODEuNi0zOC4yNS04MS42LTc2LjUgICAgYzAtNDMuMzUsMzMuMTUtOTEuOCwxMDQuNTUtOTEuOGgxMDcuMWwtNy42NDksNy42NUwyODMuMDUsOTYuOWwtMi41NSwyLjU1aC0xNy44NWMxMC4xOTksMTAuMiwyMi45NDksMjguMDUsMjIuOTQ5LDU2LjEgICAgYzAsMzUuNy0xNy44NSw1My41NS00MC44LDY4Ljg1Yy01LjEsMi41NS0xMC4yLDEwLjItMTAuMiwxNy44NXM1LjEsMTIuNzUsMTAuMiwxNS4zYzIuNTUsMi41NSw3LjY1LDUuMTAxLDEyLjc1LDcuNjUgICAgYzIwLjQsMTUuMyw0OC40NSwzMy4xNDksNDguNDUsNzMuOTVDMzA2LDM4NS4wNSwyNzIuODUsNDM4LjYsMTgxLjA1LDQzOC42eiBNNDMzLjUsMjU1aC01MXY1MUgzNTd2LTUxaC01MXYtMjUuNWg1MXYtNTFoMjUuNXY1MSAgICBoNTFWMjU1eiIgZmlsbD0iIzc1NzU3NSIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=\") center no-repeat;\r\n}\r\n\r\n.icon-material_tw {\r\n    background: url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDUxMCA1MTAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMCA1MTA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0icG9zdC10d2l0dGVyIj4KCQk8cGF0aCBkPSJNNDU5LDBINTFDMjIuOTUsMCwwLDIyLjk1LDAsNTF2NDA4YzAsMjguMDUsMjIuOTUsNTEsNTEsNTFoNDA4YzI4LjA1LDAsNTEtMjIuOTUsNTEtNTFWNTFDNTEwLDIyLjk1LDQ4Ny4wNSwwLDQ1OSwweiAgICAgTTQwMC4zNSwxODYuMTVjLTIuNTUsMTE3LjMtNzYuNSwxOTguOS0xODguNywyMDRDMTY1Ljc1LDM5Mi43LDEzMi42LDM3Ny40LDEwMiwzNTkuNTVjMzMuMTUsNS4xMDEsNzYuNS03LjY0OSw5OS40NS0yOC4wNSAgICBjLTMzLjE1LTIuNTUtNTMuNTUtMjAuNC02My43NS00OC40NWMxMC4yLDIuNTUsMjAuNCwwLDI4LjA1LDBjLTMwLjYtMTAuMi01MS0yOC4wNS01My41NS02OC44NWM3LjY1LDUuMSwxNy44NSw3LjY1LDI4LjA1LDcuNjUgICAgYy0yMi45NS0xMi43NS0zOC4yNS02MS4yLTIwLjQtOTEuOGMzMy4xNSwzNS43LDczLjk1LDY2LjMsMTQwLjI1LDcxLjRjLTE3Ljg1LTcxLjQsNzkuMDUxLTEwOS42NSwxMTcuMzAxLTYxLjIgICAgYzE3Ljg1LTIuNTUsMzAuNi0xMC4yLDQzLjM1LTE1LjNjLTUuMSwxNy44NS0xNS4zLDI4LjA1LTI4LjA1LDM4LjI1YzEyLjc1LTIuNTUsMjUuNS01LjEsMzUuNy0xMC4yICAgIEM0MjUuODUsMTY1Ljc1LDQxMy4xLDE3NS45NSw0MDAuMzUsMTg2LjE1eiIgZmlsbD0iIzc1NzU3NSIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=\") center no-repeat;\r\n}\r\n\r\n.icon-material_li {\r\n    background: url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDUxMCA1MTAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMCA1MTA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0icG9zdC1saW5rZWRpbiI+CgkJPHBhdGggZD0iTTQ1OSwwSDUxQzIyLjk1LDAsMCwyMi45NSwwLDUxdjQwOGMwLDI4LjA1LDIyLjk1LDUxLDUxLDUxaDQwOGMyOC4wNSwwLDUxLTIyLjk1LDUxLTUxVjUxQzUxMCwyMi45NSw0ODcuMDUsMCw0NTksMHogICAgIE0xNTMsNDMzLjVINzYuNVYyMDRIMTUzVjQzMy41eiBNMTE0Ljc1LDE2MC42NWMtMjUuNSwwLTQ1LjktMjAuNC00NS45LTQ1LjlzMjAuNC00NS45LDQ1LjktNDUuOXM0NS45LDIwLjQsNDUuOSw0NS45ICAgIFMxNDAuMjUsMTYwLjY1LDExNC43NSwxNjAuNjV6IE00MzMuNSw0MzMuNUgzNTdWMjk4LjM1YzAtMjAuMzk5LTE3Ljg1LTM4LjI1LTM4LjI1LTM4LjI1cy0zOC4yNSwxNy44NTEtMzguMjUsMzguMjVWNDMzLjVIMjA0ICAgIFYyMDRoNzYuNXYzMC42YzEyLjc1LTIwLjQsNDAuOC0zNS43LDYzLjc1LTM1LjdjNDguNDUsMCw4OS4yNSw0MC44LDg5LjI1LDg5LjI1VjQzMy41eiIgZmlsbD0iIzc1NzU3NSIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=\") center no-repeat;\r\n}\r\n", ""]);

// exports


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  XmlEntities: __webpack_require__(60),
  Html4Entities: __webpack_require__(59),
  Html5Entities: __webpack_require__(10),
  AllHtmlEntities: __webpack_require__(10)
};


/***/ }),
/* 59 */
/***/ (function(module, exports) {

var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];

var alphaIndex = {};
var numIndex = {};

var i = 0;
var length = HTML_ALPHA.length;
while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
}

/**
 * @constructor
 */
function Html4Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1).toLowerCase() === 'x' ?
                parseInt(entity.substr(2), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.decode = function(str) {
    return new Html4Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var alpha = numIndex[str.charCodeAt(i)];
        result += alpha ? "&" + alpha + ";" : str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encode = function(str) {
    return new Html4Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var cc = str.charCodeAt(i);
        var alpha = numIndex[cc];
        if (alpha) {
            result += "&" + alpha + ";";
        } else if (cc < 32 || cc > 126) {
            result += "&#" + cc + ";";
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonUTF = function(str) {
    return new Html4Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonASCII = function(str) {
    return new Html4Entities().encodeNonASCII(str);
};

module.exports = Html4Entities;


/***/ }),
/* 60 */
/***/ (function(module, exports) {

var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
};

var CHAR_INDEX = {
    60: 'lt',
    62: 'gt',
    34: 'quot',
    39: 'apos',
    38: 'amp'
};

var CHAR_S_INDEX = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    '&': '&amp;'
};

/**
 * @constructor
 */
function XmlEntities() {}

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/<|>|"|'|&/g, function(s) {
        return CHAR_S_INDEX[s];
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encode = function(str) {
    return new XmlEntities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ?
                parseInt(s.substr(3), 16) :
                parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return ALPHA_INDEX[s] || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.decode = function(str) {
    return new XmlEntities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var alpha = CHAR_INDEX[c];
        if (alpha) {
            result += "&" + alpha + ";";
            i++;
            continue;
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonUTF = function(str) {
    return new XmlEntities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLenght = str.length;
    var result = '';
    var i = 0;
    while (i < strLenght) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonASCII = function(str) {
    return new XmlEntities().encodeNonASCII(str);
 };

module.exports = XmlEntities;


/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = "<!--<router-outlet></router-outlet>-->\r\n<devbutton></devbutton>\r\n\r\n<!--<dynamic-component *ngFor=\"let page of pages\" [page]=\"page\" [type]=\"page.pageTemplate\">\r\n        \r\n    </dynamic-component>-->\r\n\r\n<input type=\"checkbox\" id=\"showSearchSidebar\" />\r\n<my-searchsidebar class=\"sidebar\"></my-searchsidebar>\r\n<my-fab></my-fab>\r\n<label class=\"grayout6\" for=\"showSearchSidebar\"></label>\r\n\r\n<login></login>\r\n\r\n<input type=\"checkbox\" id=\"showTextSidebar\" />\r\n<my-textsidebar class=\"sidebar\"></my-textsidebar>\r\n<my-text class=\"component\"></my-text>\r\n<label class=\"grayout1\" for=\"showTextSidebar\"></label>\r\n\r\n<input type=\"checkbox\" id=\"showTeamSidebar\" />\r\n<my-teamsidebar class=\"sidebar\"></my-teamsidebar>\r\n<my-team class=\"component\"></my-team>\r\n<label class=\"grayout2\" for=\"showTeamSidebar\"></label>\r\n\r\n<input type=\"checkbox\" id=\"showPersonSidebar\" />\r\n<my-personsidebar class=\"sidebar\"></my-personsidebar>\r\n<my-person class=\"component\"></my-person>\r\n<label class=\"grayout3\" for=\"showPersonSidebar\"></label>\r\n\r\n<input type=\"checkbox\" id=\"showProductSidebar\" />\r\n<my-productsidebar class=\"sidebar\"></my-productsidebar>\r\n<my-product class=\"component\"></my-product>\r\n<label class=\"grayout4\" for=\"showProductSidebar\"></label>\r\n\r\n<input type=\"checkbox\" id=\"showGallerySidebar\" />\r\n<my-gallerysidebar class=\"sidebar\"></my-gallerysidebar>\r\n<my-gallery class=\"component\"></my-gallery>\r\n<label class=\"grayout5\" for=\"showGallerySidebar\"></label>\r\n\r\n\r\n<my-footer></my-footer>\r\n\r\n<span></span>";

/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = "<img src=\"/assets/icons/adown.svg\" />";

/***/ }),
/* 63 */
/***/ (function(module, exports) {

module.exports = "<img src=\"/assets/icons/edit.svg\"/>";

/***/ }),
/* 64 */
/***/ (function(module, exports) {

module.exports = "";

/***/ }),
/* 65 */
/***/ (function(module, exports) {

module.exports = "<img src=\"/assets/icons/aup.svg\" />";

/***/ }),
/* 66 */
/***/ (function(module, exports) {

module.exports = "<footer class=\"footer-component {{backgroundColorClass}}\">\r\n    <section class=\"publicy\">\r\n\r\n        <section class=\"address\">\r\n            <p class=\"footer-title display-1\">{{title1}}</p>\r\n            <p class=\"footer-cont-item\">{{city}}</p>\r\n            <p class=\"footer-cont-item\">{{street}}</p>\r\n            <p class=\"footer-cont-item\">{{zipCode}}</p>\r\n\r\n        </section>\r\n\r\n        <section class=\"snetwork\">\r\n            <p class=\"footer-title display-1\">{{title2}}</p>\r\n            <div class=\"social-icons\">\r\n                <a href=\"{{vk_url}}\" target=\"_blank\"><img src={{vk_icon}} alt=\"vk\"/></a>\r\n                <a href=\"{{fb_url}}\" target=\"_blank\"><img src={{fb_icon}} alt=\"fb\"/></a>\r\n                <a href=\"{{tg_url}}\" target=\"_blank\"><img src={{tg_icon}} alt=\"tg\"/></a>\r\n                <a href=\"{{tw_url}}\" target=\"_blank\"><img src={{tw_icon}} alt=\"tw\"/></a>\r\n                <a href=\"{{gp_url}}\" target=\"_blank\"><img src={{gp_icon}} alt=\"gp\"/></a>\r\n            </div>\r\n        </section>\r\n\r\n        <section class=\"contact\">\r\n            <p class=\"footer-title display-1\">{{title3}}</p>\r\n            <p class=\"footer-cont-item\">{{phoneNumber}}</p>\r\n            <p class=\"footer-cont-item\">{{email}}</p>\r\n            <p class=\"footer-cont-item\">{{skype}}</p>\r\n            <p class=\"footer-cont-item\">{{whatsApp}}</p>\r\n        </section>\r\n\r\n    </section>\r\n\r\n    <section class=\"technical-info\">\r\n        <p>{{tech}}</p>\r\n    </section>\r\n\r\n</footer>";

/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = "<script>\r\nfunction masonry(grid, gridCell, gridGutter, dGridCol, tGridCol, mGridCol) {\r\n    var g = document.querySelector(grid),\r\n        gc = document.querySelectorAll(gridCell),\r\n        gcLength = gc.length,\r\n        gHeight = 0,\r\n        i;\r\n\r\n    for (i = 0; i < gcLength; ++i) {\r\n        gHeight += gc[i].offsetHeight + parseInt(gridGutter);\r\n    }\r\n\r\n    if (window.screen.width >= 1024)\r\n        g.style.height = gHeight / dGridCol + gHeight / (gcLength + 1) + \"px\";\r\n    else if (window.screen.width < 1024 && window.screen.width >= 768)\r\n        g.style.height = gHeight / tGridCol + gHeight / (gcLength + 1) + \"px\";\r\n    else\r\n        g.style.height = gHeight / mGridCol + gHeight / (gcLength + 1) + \"px\";\r\n}\r\n\r\n[\"resize\", \"load\"].forEach(function (event) {\r\n    window.addEventListener(event, function () {\r\n        imagesLoaded(document.querySelector('.masonry'), function () {\r\n            // A maonsry grid with 8px gutter, with 3 columns on desktop, 2 on tablet, and 1 column on mobile devices.\r\n            masonry(\".masonry\", \".masonry-brick\", 8, 3, 2, 1);\r\n        });\r\n    });\r\n\r\nvar masonryElem = document.querySelector('.masonry');\r\nmasonryElem.insertAdjacentHTML(\"afterend\", \"\r\nLoading...\");\r\nvar masonryPreloader = document.querySelector('.masonry-preloader');\r\n\r\n[\"resize\", \"load\"].forEach(function(event) {\r\n  // Hiding the preloader\r\n  masonryElem.style.display=\"none\";\r\n  window.addEventListener(event, function() {\r\n    imagesLoaded( document.querySelector('.masonry'), function() {\r\n      masonryElem.style.display=\"flex\";\r\n      masonryPreloader.style.display=\"none\";\r\n      // A masonry grid with 8px gutter, with 3 columns on desktop, 2 on tablet, and 1 column on mobile devices.\r\n      masonry(\".masonry\", \".masonry-brick\", 8, 3, 2, 1);\r\n      console.log(\"Loaded\");\r\n    });\r\n  }, false);\r\n});\r\n</script>\r\n\r\n<section class=\"gallery-component block-component {{model.backgroundColor}}\" [style.background-color]=\"getBackgroundColor()\">\r\n    <h2 class=\"gallery-titlte display-2\">{{model.title}}</h2>\r\n\r\n    <div class=\"masonry masonry--h\">\r\n        <div class=\"masonry-brick masonry-brick--h\"><article class=\"product-gallery-text\"><p>{{model.description1}}</p></article><img src=\"{{model.ImgUrl1}}\" alt=\"img\" class=\"masonry-img\"/></div>\r\n        <div class=\"masonry-brick masonry-brick--h\"><article class=\"product-gallery-text\"><p>{{model.description2}}</p></article><img src=\"{{model.ImgUrl2}}\" alt=\"img\" class=\"masonry-img\"/></div>\r\n        <div class=\"masonry-brick masonry-brick--h\"><article class=\"product-gallery-text\"><p>{{model.description3}}</p></article><img src=\"{{model.ImgUrl3}}\" alt=\"img\" class=\"masonry-img\"/></div>\r\n    </div>\r\n\r\n    <section class=\"btnSection\">\r\n        <label class=\"round-btn material-red edit-btn\" for=\"showGallerySidebar\"><edit-btn></edit-btn></label>\r\n        <label class=\"round-btn material-red up-btn\"><up-btn></up-btn></label>\r\n        <label class=\"round-btn material-red down-btn\"><down-btn></down-btn></label>\r\n        <label class=\"round-btn material-red trash-btn\"><trash-btn></trash-btn></label>\r\n    </section>\r\n\r\n</section>";

/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = "<input type=\"checkbox\" id=\"showSignIn\"/>\r\n<div class=\"form signIn\">\r\n    <form #loginForm=\"ngForm\" (ngSubmit)=\"doLogin($event)\" style=\"position: relative\">\r\n\r\n        <input type=\"password\" placeholder=\"Password\" [(ngModel)]=\"password\" #name=\"ngModel\" name=\"password\" required/>\r\n\r\n        <button type=\"submit\" value=\"Login\" class=\"button btn\" [disabled]=\"!loginForm.form.valid\"></button>\r\n\r\n        <label for=\"showSignIn\" class=\"closeWindow\"></label>\r\n\r\n    </form>\r\n</div>";

/***/ }),
/* 69 */
/***/ (function(module, exports) {

module.exports = "<!--<div class='main-nav'>\r\n    <div class='navbar navbar-inverse'>\r\n        <div class='navbar-header'>\r\n            <button type='button' class='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>\r\n                <span class='sr-only'>Toggle navigation</span>\r\n                <span class='icon-bar'></span>\r\n                <span class='icon-bar'></span>\r\n                <span class='icon-bar'></span>\r\n            </button>\r\n            <a class='navbar-brand' [routerLink]=\"['/home']\">StartFolio</a>\r\n        </div>\r\n        <div class='clearfix'></div>\r\n        <div class='navbar-collapse collapse'>\r\n            <ul class='nav navbar-nav'>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/home']\">\r\n                        <span class='glyphicon glyphicon-home'></span> Home\r\n                    </a>\r\n                </li>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/counter']\">\r\n                        <span class='glyphicon glyphicon-education'></span> Counter\r\n                    </a>\r\n                </li>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/fetch-data']\">\r\n                        <span class='glyphicon glyphicon-th-list'></span> Fetch data\r\n                    </a>\r\n                </li>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/text']\">\r\n                        <span class='glyphicon glyphicon-ice-lolly'></span> Some\r\n                    </a>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n    </div>\r\n</div>\r\n    -->\r\n";

/***/ }),
/* 70 */
/***/ (function(module, exports) {

module.exports = "<section class=\"person-component block-component {{model.backgroundColor}}\" [style.background-color]=\"getBackgroundColor()\">\r\n    \r\n    <section class=\"person-photo\">\r\n        <img src=\"{{model.personImgUrl}}\" alt=\"img\"/>\r\n    </section>\r\n\r\n    <section class=\"person-component-content\">\r\n\r\n        <h2 class=\"person-component-title display-2\">{{model.title}}</h2>\r\n        <article class=\"person-component-opinion main-text body-2 text-large\">{{model.opinion}}</article>\r\n\r\n        <section class=\"person-info sub-text body-2 text-large\">\r\n            <section class=\"person-name\">\r\n                <p>{{model.Name}}</p>, <p>{{model.Surname}}</p>\r\n            </section>\r\n            <p>{{model.Age}}</p>\r\n            <p>{{model.Occupation}}</p>\r\n        </section>\r\n\r\n    </section>\r\n\r\n    <section class=\"btnSection\">\r\n        <label class=\"round-btn material-red edit-btn\" for=\"showPersonSidebar\"><edit-btn></edit-btn></label>\r\n        <label class=\"round-btn material-red up-btn\"><up-btn></up-btn></label>\r\n        <label class=\"round-btn material-red down-btn\"><down-btn></down-btn></label>\r\n        <label class=\"round-btn material-red trash-btn\"><trash-btn></trash-btn></label>\r\n    </section>\r\n\r\n\r\n</section>";

/***/ }),
/* 71 */
/***/ (function(module, exports) {

module.exports = "<section class=\"product-component block-component {{model.backgroundColor}}\" [style.background-color]=\"getBackgroundColor()\">\r\n    \r\n    <section class=\"product-demo\">\r\n        <img src=\"{{model.productImgUrl}}\" alt=\"img\"/>\r\n    </section>\r\n\r\n    <section class=\"product-component-content\">\r\n        <h2 class=\"product-component-title display-2\">{{model.title}}</h2>\r\n        <article class=\"text-large body-2\">{{model.mainText}}</article>\r\n        <article class=\"text-large body-2\">{{model.subText}} </article>\r\n    </section>\r\n   \r\n    <section class=\"btnSection\">\r\n        <label class=\"round-btn material-blue edit-btn\" for=\"showProductSidebar\"><edit-btn></edit-btn></label>\r\n        <label class=\"round-btn material-blue up-btn\"><up-btn></up-btn></label>\r\n        <label class=\"round-btn material-blue down-btn\"><down-btn></down-btn></label>\r\n        <label class=\"round-btn material-blue trash-btn\"><trash-btn></trash-btn></label>\r\n    </section>\r\n\r\n</section>";

/***/ }),
/* 72 */
/***/ (function(module, exports) {

module.exports = "<h2 class=\"display-2 comp-h2\" style=\"font-size: 20px\">{{componentTitle}}</h2>\r\n<div class=\"searchable-block\">\r\n    <img src=\"{{previewLink}}\" alt=\"component\"/>\r\n</div>";

/***/ }),
/* 73 */
/***/ (function(module, exports) {

module.exports = "<section class=\"sidebar-header material-green\">\r\n    <h2 class=\"display-1\" style=\"color: white\">Gallery component</h2>\r\n</section>\r\n\r\n<section class=\"sidebar-content\">\r\n\r\n    <form class=\"Options\" [formGroup]=\"galleryEditForm\" (ngSubmit)=\"save(galleryEditForm.value)\">\r\n\r\n        <label class=\"optionTitle\">Text title</label>\r\n        <input type=\"text\" formControlName=\"title\" />\r\n\r\n\r\n\r\n\r\n        <label class=\"optionTitle\">Project 1 description</label>\r\n        <input type=\"text\" formControlName=\"description1\" />\r\n\r\n        <label class=\"optionTitle\">First photo</label>\r\n        <input type=\"file\" accept=\"image/*\" formControlName=\"imgUrl1\" (change)=\"updateImage($event, 1)\" />\r\n\r\n\r\n\r\n\r\n        <label class=\"optionTitle\">Project 2 description</label>\r\n        <input type=\"text\" formControlName=\"description2\" />\r\n\r\n        <label class=\"optionTitle\">Second photo</label>\r\n        <input type=\"file\" accept=\"image/*\" formControlName=\"imgUrl2\" (change)=\"updateImage($event, 2)\" />\r\n\r\n\r\n\r\n\r\n        <label class=\"optionTitle\">Project 3 description</label>\r\n        <input type=\"text\" formControlName=\"description3\" />\r\n\r\n        <label class=\"optionTitle\">Third photo</label>\r\n        <input type=\"file\" accept=\"image/*\" formControlName=\"imgUrl3\" (change)=\"updateImage($event, 3)\" />\r\n\r\n        <label class=\"optionTitle\">Background color</label>\r\n        <input type=\"color\" formControlName=\"backgroundColor\"/>\r\n\r\n        <!--ngFor version\r\n    <div class=\"image-upload\" *ngFor=\"let photo of photos; let i = index\">\r\n        <label class=\"optionTitle\"></label>\r\n        <input type=\"file\" accept=\"image/*\" (change)=\"updateImage($event, i)\" required />\r\n    </div>\r\n\r\n    <label class=\"optionTitle\">Background color</label>\r\n    <input type=\"color\" [(ngModel)]=\"model.backgroundColor\" #backgroundColor=\"ngModel\"/>\r\n\r\n    <input class=\"btn button\" type=\"submit\" [disabled]=\"!galleryEditForm.form.valid\"/>-->\r\n        <button type=\"submit\" class=\"btn button\">Submit</button>\r\n    </form>\r\n\r\n</section>";

/***/ }),
/* 74 */
/***/ (function(module, exports) {

module.exports = "<section class=\"sidebar-header material-orange\">\r\n    <h2 class=\"display-1\" style=\"color: white\">Person component</h2>\r\n</section>\r\n\r\n<section class=\"sidebar-content\">\r\n\r\n    <form class=\"Options\" [formGroup]=\"personEditForm\" (ngSubmit)=\"save(personEditForm.value)\">\r\n\r\n        <label class=\"optionTitle\">Text title</label>\r\n        <input type=\"text\" formControlName=\"title\"/>\r\n\r\n        <label class=\"optionTitle\">Main text</label>\r\n        <textarea formControlName=\"mainText\"></textarea>\r\n\r\n        <label class=\"optionTitle\">Name, surname</label>\r\n        <input type=\"text\" formControlName=\"personName\"/>\r\n\r\n        <label class=\"optionTitle\">Age</label>\r\n        <input type=\"text\" formControlName=\"age\"/>\r\n\r\n        <label class=\"optionTitle\">Position</label>\r\n        <input type=\"text\" formControlName=\"position\"/>\r\n\r\n        <label class=\"optionTitle\">Person photo</label>\r\n        <input type=\"file\" accept=\"image/*\" (change)=\"updateImage($event)\" formControlName=\"photo\"/>\r\n\r\n        <label class=\"optionTitle\">Background color</label>\r\n        <input type=\"color\" formControlName=\"backgroundColor\"/>\r\n\r\n        <button class=\"btn button\" type=\"submit\">Submit</button>\r\n    </form>\r\n\r\n</section>";

/***/ }),
/* 75 */
/***/ (function(module, exports) {

module.exports = "<section class=\"sidebar-header material-blue\">\r\n    <h2 class=\"display-1\" style=\"color: white\">Product component</h2>\r\n</section>\r\n\r\n<section class=\"sidebar-content\">\r\n\r\n    <form class=\"Options\" [formGroup]=\"productEditForm\" (ngSubmit)=\"save(productEditForm.value)\">\r\n\r\n        <label class=\"optionTitle\">Text title</label>\r\n        <input type=\"text\" formControlName=\"title\"/>\r\n\r\n        <label class=\"optionTitle\">Main text</label>\r\n        <textarea formControlName=\"mainText\"></textarea>\r\n\r\n        <label class=\"optionTitle\">Sub text</label>\r\n        <textarea formControlName=\"subText\"></textarea>\r\n\r\n        <label class=\"optionTitle\">Product demo photo</label>\r\n        <input type=\"file\" accept=\"image/*\" (change)=\"updateImage($event)\" formControlName=\"photo\"/>\r\n\r\n        <label class=\"optionTitle\">Background color</label>\r\n        <input type=\"color\" formControlName=\"backgroundColor\"/>\r\n\r\n        <button class=\"btn button material-blue\" type=\"submit\">Submit</button>\r\n\r\n    </form>\r\n\r\n</section>";

/***/ }),
/* 76 */
/***/ (function(module, exports) {

module.exports = "<section class=\"sidebar-header material-green\">\r\n    <h2 class=\"display-1\" style=\"color: white\">Components</h2>\r\n</section>\r\n\r\n<section class=\"sidebar-content\">\r\n\r\n    <section class=\"componentSearch\">\r\n        <input type=\"search\" class=\"searchField\"/>\r\n        <img src=\"/assets/icons/search.svg\" class=\"searchBtn\"/>\r\n    </section>\r\n\r\n\r\n    <div class=\"horizontal-separator\"></div>\r\n\r\n    <!--<h2 class=\"display-2\" style=\"font-size: 20px\">HERE WILL BE SEARCH RESULT!</h2>-->\r\n\r\n    <section class=\"available-components\">\r\n        <searchable [componentTitle]=\"titles0\"\r\n                    [previewLink]=\"previews0\"\r\n                    (click) =\"createPage(template0)\"></searchable>\r\n        <searchable [componentTitle]=\"titles1\"\r\n                    [previewLink]=\"previews1\"\r\n                     (click) =\"createPage(template1)\"></searchable>\r\n        <searchable [componentTitle]=\"titles2\"\r\n                    [previewLink]=\"previews2\"\r\n                     (click) =\"createPage(template2)\"></searchable>\r\n        <searchable [componentTitle]=\"titles3\"\r\n                    [previewLink]=\"previews3\"\r\n                     (click) =\"createPage(template3)\"></searchable>\r\n        <searchable [componentTitle]=\"titles4\"\r\n                    [previewLink]=\"previews4\"\r\n                     (click) =\"createPage(template4)\"></searchable>\r\n\r\n    </section>\r\n\r\n</section>";

/***/ }),
/* 77 */
/***/ (function(module, exports) {

module.exports = "<div>\r\n    <section class=\"sidebar-header material-red\">\r\n        <h2 class=\"display-1\" style=\"color: white\">Team component</h2>\r\n    </section>\r\n\r\n    <section class=\"sidebar-content\">\r\n    \r\n        <form class=\"Options\"  [formGroup]=\"teamEditForm\" (ngSubmit)=\"save(teamEditForm.value)\">\r\n\r\n            <label class=\"optionTitle\">Text title</label>\r\n            <input type=\"text\" formControlName=\"title\" />\r\n\r\n            <label class=\"optionTitle\">Main text</label>\r\n            <textarea formControlName=\"mainText\" ></textarea>\r\n\r\n            <label class=\"optionTitle\">Background color</label>\r\n            <input type=\"color\" formControlName=\"backgroundColor\" />\r\n    \r\n            <!--Hardcode version-->\r\n            <label class=\"optionTitle\">Teammate 1</label>\r\n                <label class=\"optionTitle\">Name, surname</label>\r\n                <input type=\"text\" formControlName=\"teammate1_Name\" />\r\n\r\n                <label class=\"optionTitle\">Short description</label>\r\n                <input type=\"text\" formControlName=\"teammate1_Description\" />\r\n\r\n                <label class=\"optionTitle\">Link to profile</label>\r\n                <input type=\"url\" formControlName=\"teammate1_Link\" />\r\n\r\n                <label class=\"optionTitle\">Teammate photo</label>\r\n                <input type=\"file\" accept=\"image/*\" (change)=\"updateImage($event, 1)\" formControlName=\"teammate1_Photo\"/>\r\n\r\n    \r\n            <label class=\"optionTitle\">Teammate 2</label>\r\n                <label class=\"optionTitle\">Name, surname</label>\r\n                <input type=\"text\" formControlName=\"teammate2_Name\" />\r\n\r\n                <label class=\"optionTitle\">Short description</label>\r\n                <input type=\"text\" formControlName=\"teammate2_Description\" />\r\n\r\n                <label class=\"optionTitle\">Link to profile</label>\r\n                <input type=\"url\" formControlName=\"teammate2_Link\"/>\r\n\r\n                <label class=\"optionTitle\">Teammate photo</label>\r\n                <input type=\"file\" accept=\"image/*\" (change)=\"updateImage($event, 2)\" formControlName=\"teammate2_Photo\"/>\r\n            \r\n\r\n            <!--ngFor version-->\r\n\r\n            <!--\r\n            <div *ngFor=\"let teammate of teammates; let i = index\" [indexNo]=\"i\">\r\n            </div>\r\n            -->\r\n    \r\n            <button class=\"btn button material-green\" type=\"submit\">Submit</button>\r\n        </form>\r\n    \r\n    </section>\r\n</div>";

/***/ }),
/* 78 */
/***/ (function(module, exports) {

module.exports = "<section class=\"sidebar-header material-green\">\r\n    <h2 class=\"display-1\" style=\"color: white\">Text component</h2>\r\n</section>\r\n\r\n<section class=\"sidebar-content\">\r\n\r\n    <form class=\"Options\" [formGroup]=\"textEditForm\" (ngSubmit)=\"save(textEditForm.value)\">\r\n        <label class=\"optionTitle\">Text title</label>\r\n        <input type=\"text\" formControlName=\"title\" />\r\n\r\n        <label class=\"optionTitle\">Main text</label>\r\n        <textarea formControlName=\"mainText\"></textarea>\r\n\r\n        <label class=\"optionTitle\">Sub text</label>\r\n        <textarea formControlName=\"subText\"></textarea>\r\n\r\n        <label class=\"optionTitle\">Background color</label>\r\n        <input type=\"color\" formControlName=\"backgroundColor\" />\r\n\r\n        <label class=\"optionTitle\">Left button text</label>\r\n        <input type=\"text\" formControlName=\"buttonLeftText\" />\r\n\r\n        <label class=\"optionTitle\">Left button link</label>\r\n        <input type=\"text\" formControlName=\"buttonLeftLink\" />\r\n\r\n        <label class=\"optionTitle\">Right button text</label>\r\n        <input type=\"text\" formControlName=\"buttonRightText\" />\r\n\r\n        <label class=\"optionTitle\">Right button link</label>\r\n        <input type=\"text\" formControlName=\"buttonRightLink\" />\r\n\r\n        <button class=\"btn button\" type=\"submit\">Submit</button>\r\n    </form>\r\n\r\n</section>";

/***/ }),
/* 79 */
/***/ (function(module, exports) {

module.exports = "<section class=\"team-component block-component {{model.backgroundColor}}\" [style.background-color]=\"getBackgroundColor()\">\r\n\r\n    <h2 class=\"team-component-title display-2\">{{model.title}}</h2>\r\n\r\n    <article class=\"team-component-content main-text body-2 text-large\">{{model.mainText}}</article>\r\n\r\n    <ul class=\"cards\">\r\n        <teammate [name]       =\"model.stName\" \r\n                  [photo]      =\"model.stPhoto\" \r\n                  [description]=\"model.stDesc\" \r\n                  [profileLink]=\"model.stLink\"></teammate>\r\n\r\n        <teammate [name]       =\"model.ndName\"\r\n                  [photo]      =\"model.ndPhoto\"\r\n                  [description]=\"model.ndDesc\"\r\n                  [profileLink]=\"model.ndLink\"></teammate>\r\n    </ul>\r\n\r\n    <section class=\"btnSection\">\r\n        <label class=\"round-btn material-red edit-btn\" for=\"showTeamSidebar\"><edit-btn></edit-btn></label>\r\n        <label class=\"round-btn material-red up-btn\"><up-btn></up-btn></label>\r\n        <label class=\"round-btn material-red down-btn\"><down-btn></down-btn></label>\r\n        <label class=\"round-btn material-red trash-btn\"><trash-btn></trash-btn></label>\r\n    </section>\r\n\r\n</section>";

/***/ }),
/* 80 */
/***/ (function(module, exports) {

module.exports = "<li class=\"cards__item\">\r\n    <div class=\"card\">\r\n        <div class=\"card__image\">\r\n            <img src=\"{{photo}}\" alt=\"teammate\"/>\r\n        </div>\r\n        <div class=\"card__content\">\r\n            <div class=\"card__title\">{{name}}</div>\r\n            <div class=\"card__text\">{{description}}</div>\r\n            <a href=\"{{profileLink}}\" target=\"_blank\"><button class=\"btn button\">Profile</button></a>\r\n        </div>\r\n    </div>\r\n</li>";

/***/ }),
/* 81 */
/***/ (function(module, exports) {

module.exports = "<section [style.background-color]=\"getBackgroundColor()\" class=\"text-component block-component {{model.backgroundColor}}\">\r\n\r\n    <h2 class=\"text-component-title display-2\">{{model.title}}</h2>\r\n\r\n    <article class=\"text-component-content main-text body-2 text-large\">{{model.mainText}}</article>\r\n\r\n    <article class=\"text-component-content sub-text body-2 text-large\">{{model.subText}}</article>\r\n\r\n    <section class=\"button-section\">\r\n        <a href=\"{{model.buttonLeftLink}}\" target=\"_blank\"><button  class=\"btn button\">{{model.buttonLeftText}} </button></a>\r\n        <a href=\"{{model.buttonRightLink}}\" target=\"_blank\"><button class=\"btn button\">{{model.buttonRightText}}</button></a>\r\n    </section>\r\n    \r\n    <section class=\"btnSection\">\r\n        <label class=\"round-btn material-red edit-btn\" for=\"showTextSidebar\"><edit-btn></edit-btn></label>\r\n        <label class=\"round-btn material-red up-btn\" ><up-btn></up-btn></label>\r\n        <label class=\"round-btn material-red down-btn\"><down-btn></down-btn></label>\r\n        <label class=\"round-btn material-red trash-btn\"><trash-btn></trash-btn></label>\r\n    </section>\r\n\r\n</section>";

/***/ }),
/* 82 */
/***/ (function(module, exports) {

module.exports = "<label for=\"showSignIn\" class=\"btn button developerButton button-mimic hidden-devBtn\" id=\"devButton\" onclick=\"developerCheck()\">\r\n    Developer?\r\n</label>";

/***/ }),
/* 83 */
/***/ (function(module, exports) {

module.exports = "<label class=\"fab editButton\" for=\"showSearchSidebar\">\r\n    <span class=\"fab-action-button\">\r\n        <i class=\"fab-action-button__icon\"></i>\r\n    </span>\r\n</label>";

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(84);
exports.encode = exports.stringify = __webpack_require__(85);


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Reflect;
(function (Reflect) {
    "use strict";
    var hasOwn = Object.prototype.hasOwnProperty;
    // feature test for Symbol support
    var supportsSymbol = typeof Symbol === "function";
    var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
    var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
    var HashMap;
    (function (HashMap) {
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        // create an object in dictionary mode (a.k.a. "slow" mode in v8)
        HashMap.create = supportsCreate
            ? function () { return MakeDictionary(Object.create(null)); }
            : supportsProto
                ? function () { return MakeDictionary({ __proto__: null }); }
                : function () { return MakeDictionary({}); };
        HashMap.has = downLevel
            ? function (map, key) { return hasOwn.call(map, key); }
            : function (map, key) { return key in map; };
        HashMap.get = downLevel
            ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
            : function (map, key) { return map[key]; };
    })(HashMap || (HashMap = {}));
    // Load global or shim versions of Map, Set, and WeakMap
    var functionPrototype = Object.getPrototypeOf(Function);
    var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
    var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
    var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
    var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
    // [[Metadata]] internal slot
    // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
    var Metadata = new _WeakMap();
    /**
      * Applies a set of decorators to a property of a target object.
      * @param decorators An array of decorators.
      * @param target The target object.
      * @param propertyKey (Optional) The property key to decorate.
      * @param attributes (Optional) The property descriptor for the target key.
      * @remarks Decorators are applied in reverse order.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     Example = Reflect.decorate(decoratorsArray, Example);
      *
      *     // property (on constructor)
      *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Object.defineProperty(Example, "staticMethod",
      *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
      *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
      *
      *     // method (on prototype)
      *     Object.defineProperty(Example.prototype, "method",
      *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
      *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
      *
      */
    function decorate(decorators, target, propertyKey, attributes) {
        if (!IsUndefined(propertyKey)) {
            if (!IsArray(decorators))
                throw new TypeError();
            if (!IsObject(target))
                throw new TypeError();
            if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                throw new TypeError();
            if (IsNull(attributes))
                attributes = undefined;
            propertyKey = ToPropertyKey(propertyKey);
            return DecorateProperty(decorators, target, propertyKey, attributes);
        }
        else {
            if (!IsArray(decorators))
                throw new TypeError();
            if (!IsConstructor(target))
                throw new TypeError();
            return DecorateConstructor(decorators, target);
        }
    }
    Reflect.decorate = decorate;
    // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
    // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
    /**
      * A default metadata decorator factory that can be used on a class, class member, or parameter.
      * @param metadataKey The key for the metadata entry.
      * @param metadataValue The value for the metadata entry.
      * @returns A decorator function.
      * @remarks
      * If `metadataKey` is already defined for the target and target key, the
      * metadataValue for that key will be overwritten.
      * @example
      *
      *     // constructor
      *     @Reflect.metadata(key, value)
      *     class Example {
      *     }
      *
      *     // property (on constructor, TypeScript only)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         static staticProperty;
      *     }
      *
      *     // property (on prototype, TypeScript only)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         property;
      *     }
      *
      *     // method (on constructor)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         static staticMethod() { }
      *     }
      *
      *     // method (on prototype)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         method() { }
      *     }
      *
      */
    function metadata(metadataKey, metadataValue) {
        function decorator(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                throw new TypeError();
            OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        return decorator;
    }
    Reflect.metadata = metadata;
    /**
      * Define a unique metadata entry on the target.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param metadataValue A value that contains attached metadata.
      * @param target The target object on which to define metadata.
      * @param propertyKey (Optional) The property key for the target.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     Reflect.defineMetadata("custom:annotation", options, Example);
      *
      *     // property (on constructor)
      *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
      *
      *     // method (on prototype)
      *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
      *
      *     // decorator factory as metadata-producing annotation.
      *     function MyAnnotation(options): Decorator {
      *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
      *     }
      *
      */
    function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
    }
    Reflect.defineMetadata = defineMetadata;
    /**
      * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.hasMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function hasMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasMetadata(metadataKey, target, propertyKey);
    }
    Reflect.hasMetadata = hasMetadata;
    /**
      * Gets a value indicating whether the target object has the provided metadata key defined.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function hasOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
    }
    Reflect.hasOwnMetadata = hasOwnMetadata;
    /**
      * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function getMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetMetadata(metadataKey, target, propertyKey);
    }
    Reflect.getMetadata = getMetadata;
    /**
      * Gets the metadata value for the provided metadata key on the target object.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function getOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
    }
    Reflect.getOwnMetadata = getOwnMetadata;
    /**
      * Gets the metadata keys defined on the target object or its prototype chain.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadataKeys(Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadataKeys(Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadataKeys(Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadataKeys(Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadataKeys(Example.prototype, "method");
      *
      */
    function getMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryMetadataKeys(target, propertyKey);
    }
    Reflect.getMetadataKeys = getMetadataKeys;
    /**
      * Gets the unique metadata keys defined on the target object.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadataKeys(Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
      *
      */
    function getOwnMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryOwnMetadataKeys(target, propertyKey);
    }
    Reflect.getOwnMetadataKeys = getOwnMetadataKeys;
    /**
      * Deletes the metadata entry from the target object with the provided key.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata entry was found and deleted; otherwise, false.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.deleteMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function deleteMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return false;
        if (!metadataMap.delete(metadataKey))
            return false;
        if (metadataMap.size > 0)
            return true;
        var targetMetadata = Metadata.get(target);
        targetMetadata.delete(propertyKey);
        if (targetMetadata.size > 0)
            return true;
        Metadata.delete(target);
        return true;
    }
    Reflect.deleteMetadata = deleteMetadata;
    function DecorateConstructor(decorators, target) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsConstructor(decorated))
                    throw new TypeError();
                target = decorated;
            }
        }
        return target;
    }
    function DecorateProperty(decorators, target, propertyKey, descriptor) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target, propertyKey, descriptor);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsObject(decorated))
                    throw new TypeError();
                descriptor = decorated;
            }
        }
        return descriptor;
    }
    function GetOrCreateMetadataMap(O, P, Create) {
        var targetMetadata = Metadata.get(O);
        if (IsUndefined(targetMetadata)) {
            if (!Create)
                return undefined;
            targetMetadata = new _Map();
            Metadata.set(O, targetMetadata);
        }
        var metadataMap = targetMetadata.get(P);
        if (IsUndefined(metadataMap)) {
            if (!Create)
                return undefined;
            metadataMap = new _Map();
            targetMetadata.set(P, metadataMap);
        }
        return metadataMap;
    }
    // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
    function OrdinaryHasMetadata(MetadataKey, O, P) {
        var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn)
            return true;
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
            return OrdinaryHasMetadata(MetadataKey, parent, P);
        return false;
    }
    // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
    function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return false;
        return ToBoolean(metadataMap.has(MetadataKey));
    }
    // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
    function OrdinaryGetMetadata(MetadataKey, O, P) {
        var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn)
            return OrdinaryGetOwnMetadata(MetadataKey, O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
            return OrdinaryGetMetadata(MetadataKey, parent, P);
        return undefined;
    }
    // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
    function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return undefined;
        return metadataMap.get(MetadataKey);
    }
    // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
    function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
        metadataMap.set(MetadataKey, MetadataValue);
    }
    // 3.1.6.1 OrdinaryMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
    function OrdinaryMetadataKeys(O, P) {
        var ownKeys = OrdinaryOwnMetadataKeys(O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (parent === null)
            return ownKeys;
        var parentKeys = OrdinaryMetadataKeys(parent, P);
        if (parentKeys.length <= 0)
            return ownKeys;
        if (ownKeys.length <= 0)
            return parentKeys;
        var set = new _Set();
        var keys = [];
        for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
            var key = ownKeys_1[_i];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
            var key = parentKeys_1[_a];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        return keys;
    }
    // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
    function OrdinaryOwnMetadataKeys(O, P) {
        var keys = [];
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return keys;
        var keysObj = metadataMap.keys();
        var iterator = GetIterator(keysObj);
        var k = 0;
        while (true) {
            var next = IteratorStep(iterator);
            if (!next) {
                keys.length = k;
                return keys;
            }
            var nextValue = IteratorValue(next);
            try {
                keys[k] = nextValue;
            }
            catch (e) {
                try {
                    IteratorClose(iterator);
                }
                finally {
                    throw e;
                }
            }
            k++;
        }
    }
    // 6 ECMAScript Data Typ0es and Values
    // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
    function Type(x) {
        if (x === null)
            return 1 /* Null */;
        switch (typeof x) {
            case "undefined": return 0 /* Undefined */;
            case "boolean": return 2 /* Boolean */;
            case "string": return 3 /* String */;
            case "symbol": return 4 /* Symbol */;
            case "number": return 5 /* Number */;
            case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
            default: return 6 /* Object */;
        }
    }
    // 6.1.1 The Undefined Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
    function IsUndefined(x) {
        return x === undefined;
    }
    // 6.1.2 The Null Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
    function IsNull(x) {
        return x === null;
    }
    // 6.1.5 The Symbol Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
    function IsSymbol(x) {
        return typeof x === "symbol";
    }
    // 6.1.7 The Object Type
    // https://tc39.github.io/ecma262/#sec-object-type
    function IsObject(x) {
        return typeof x === "object" ? x !== null : typeof x === "function";
    }
    // 7.1 Type Conversion
    // https://tc39.github.io/ecma262/#sec-type-conversion
    // 7.1.1 ToPrimitive(input [, PreferredType])
    // https://tc39.github.io/ecma262/#sec-toprimitive
    function ToPrimitive(input, PreferredType) {
        switch (Type(input)) {
            case 0 /* Undefined */: return input;
            case 1 /* Null */: return input;
            case 2 /* Boolean */: return input;
            case 3 /* String */: return input;
            case 4 /* Symbol */: return input;
            case 5 /* Number */: return input;
        }
        var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
        var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
        if (exoticToPrim !== undefined) {
            var result = exoticToPrim.call(input, hint);
            if (IsObject(result))
                throw new TypeError();
            return result;
        }
        return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
    }
    // 7.1.1.1 OrdinaryToPrimitive(O, hint)
    // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
    function OrdinaryToPrimitive(O, hint) {
        if (hint === "string") {
            var toString_1 = O.toString;
            if (IsCallable(toString_1)) {
                var result = toString_1.call(O);
                if (!IsObject(result))
                    return result;
            }
            var valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result))
                    return result;
            }
        }
        else {
            var valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result))
                    return result;
            }
            var toString_2 = O.toString;
            if (IsCallable(toString_2)) {
                var result = toString_2.call(O);
                if (!IsObject(result))
                    return result;
            }
        }
        throw new TypeError();
    }
    // 7.1.2 ToBoolean(argument)
    // https://tc39.github.io/ecma262/2016/#sec-toboolean
    function ToBoolean(argument) {
        return !!argument;
    }
    // 7.1.12 ToString(argument)
    // https://tc39.github.io/ecma262/#sec-tostring
    function ToString(argument) {
        return "" + argument;
    }
    // 7.1.14 ToPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-topropertykey
    function ToPropertyKey(argument) {
        var key = ToPrimitive(argument, 3 /* String */);
        if (IsSymbol(key))
            return key;
        return ToString(key);
    }
    // 7.2 Testing and Comparison Operations
    // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
    // 7.2.2 IsArray(argument)
    // https://tc39.github.io/ecma262/#sec-isarray
    function IsArray(argument) {
        return Array.isArray
            ? Array.isArray(argument)
            : argument instanceof Object
                ? argument instanceof Array
                : Object.prototype.toString.call(argument) === "[object Array]";
    }
    // 7.2.3 IsCallable(argument)
    // https://tc39.github.io/ecma262/#sec-iscallable
    function IsCallable(argument) {
        // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
        return typeof argument === "function";
    }
    // 7.2.4 IsConstructor(argument)
    // https://tc39.github.io/ecma262/#sec-isconstructor
    function IsConstructor(argument) {
        // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
        return typeof argument === "function";
    }
    // 7.2.7 IsPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-ispropertykey
    function IsPropertyKey(argument) {
        switch (Type(argument)) {
            case 3 /* String */: return true;
            case 4 /* Symbol */: return true;
            default: return false;
        }
    }
    // 7.3 Operations on Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-objects
    // 7.3.9 GetMethod(V, P)
    // https://tc39.github.io/ecma262/#sec-getmethod
    function GetMethod(V, P) {
        var func = V[P];
        if (func === undefined || func === null)
            return undefined;
        if (!IsCallable(func))
            throw new TypeError();
        return func;
    }
    // 7.4 Operations on Iterator Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
    function GetIterator(obj) {
        var method = GetMethod(obj, iteratorSymbol);
        if (!IsCallable(method))
            throw new TypeError(); // from Call
        var iterator = method.call(obj);
        if (!IsObject(iterator))
            throw new TypeError();
        return iterator;
    }
    // 7.4.4 IteratorValue(iterResult)
    // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
    function IteratorValue(iterResult) {
        return iterResult.value;
    }
    // 7.4.5 IteratorStep(iterator)
    // https://tc39.github.io/ecma262/#sec-iteratorstep
    function IteratorStep(iterator) {
        var result = iterator.next();
        return result.done ? false : result;
    }
    // 7.4.6 IteratorClose(iterator, completion)
    // https://tc39.github.io/ecma262/#sec-iteratorclose
    function IteratorClose(iterator) {
        var f = iterator["return"];
        if (f)
            f.call(iterator);
    }
    // 9.1 Ordinary Object Internal Methods and Internal Slots
    // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
    // 9.1.1.1 OrdinaryGetPrototypeOf(O)
    // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
    function OrdinaryGetPrototypeOf(O) {
        var proto = Object.getPrototypeOf(O);
        if (typeof O !== "function" || O === functionPrototype)
            return proto;
        // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
        // Try to determine the superclass constructor. Compatible implementations
        // must either set __proto__ on a subclass constructor to the superclass constructor,
        // or ensure each class has a valid `constructor` property on its prototype that
        // points back to the constructor.
        // If this is not the same as Function.[[Prototype]], then this is definately inherited.
        // This is the case when in ES6 or when using __proto__ in a compatible browser.
        if (proto !== functionPrototype)
            return proto;
        // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
        var prototype = O.prototype;
        var prototypeProto = prototype && Object.getPrototypeOf(prototype);
        if (prototypeProto == null || prototypeProto === Object.prototype)
            return proto;
        // If the constructor was not a function, then we cannot determine the heritage.
        var constructor = prototypeProto.constructor;
        if (typeof constructor !== "function")
            return proto;
        // If we have some kind of self-reference, then we cannot determine the heritage.
        if (constructor === O)
            return proto;
        // we have a pretty good guess at the heritage.
        return constructor;
    }
    // naive Map shim
    function CreateMapPolyfill() {
        var cacheSentinel = {};
        var arraySentinel = [];
        var MapIterator = (function () {
            function MapIterator(keys, values, selector) {
                this._index = 0;
                this._keys = keys;
                this._values = values;
                this._selector = selector;
            }
            MapIterator.prototype["@@iterator"] = function () { return this; };
            MapIterator.prototype[iteratorSymbol] = function () { return this; };
            MapIterator.prototype.next = function () {
                var index = this._index;
                if (index >= 0 && index < this._keys.length) {
                    var result = this._selector(this._keys[index], this._values[index]);
                    if (index + 1 >= this._keys.length) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    else {
                        this._index++;
                    }
                    return { value: result, done: false };
                }
                return { value: undefined, done: true };
            };
            MapIterator.prototype.throw = function (error) {
                if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                }
                throw error;
            };
            MapIterator.prototype.return = function (value) {
                if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                }
                return { value: value, done: true };
            };
            return MapIterator;
        }());
        return (function () {
            function Map() {
                this._keys = [];
                this._values = [];
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
            }
            Object.defineProperty(Map.prototype, "size", {
                get: function () { return this._keys.length; },
                enumerable: true,
                configurable: true
            });
            Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
            Map.prototype.get = function (key) {
                var index = this._find(key, /*insert*/ false);
                return index >= 0 ? this._values[index] : undefined;
            };
            Map.prototype.set = function (key, value) {
                var index = this._find(key, /*insert*/ true);
                this._values[index] = value;
                return this;
            };
            Map.prototype.delete = function (key) {
                var index = this._find(key, /*insert*/ false);
                if (index >= 0) {
                    var size = this._keys.length;
                    for (var i = index + 1; i < size; i++) {
                        this._keys[i - 1] = this._keys[i];
                        this._values[i - 1] = this._values[i];
                    }
                    this._keys.length--;
                    this._values.length--;
                    if (key === this._cacheKey) {
                        this._cacheKey = cacheSentinel;
                        this._cacheIndex = -2;
                    }
                    return true;
                }
                return false;
            };
            Map.prototype.clear = function () {
                this._keys.length = 0;
                this._values.length = 0;
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
            };
            Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
            Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
            Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
            Map.prototype["@@iterator"] = function () { return this.entries(); };
            Map.prototype[iteratorSymbol] = function () { return this.entries(); };
            Map.prototype._find = function (key, insert) {
                if (this._cacheKey !== key) {
                    this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                }
                if (this._cacheIndex < 0 && insert) {
                    this._cacheIndex = this._keys.length;
                    this._keys.push(key);
                    this._values.push(undefined);
                }
                return this._cacheIndex;
            };
            return Map;
        }());
        function getKey(key, _) {
            return key;
        }
        function getValue(_, value) {
            return value;
        }
        function getEntry(key, value) {
            return [key, value];
        }
    }
    // naive Set shim
    function CreateSetPolyfill() {
        return (function () {
            function Set() {
                this._map = new _Map();
            }
            Object.defineProperty(Set.prototype, "size", {
                get: function () { return this._map.size; },
                enumerable: true,
                configurable: true
            });
            Set.prototype.has = function (value) { return this._map.has(value); };
            Set.prototype.add = function (value) { return this._map.set(value, value), this; };
            Set.prototype.delete = function (value) { return this._map.delete(value); };
            Set.prototype.clear = function () { this._map.clear(); };
            Set.prototype.keys = function () { return this._map.keys(); };
            Set.prototype.values = function () { return this._map.values(); };
            Set.prototype.entries = function () { return this._map.entries(); };
            Set.prototype["@@iterator"] = function () { return this.keys(); };
            Set.prototype[iteratorSymbol] = function () { return this.keys(); };
            return Set;
        }());
    }
    // naive WeakMap shim
    function CreateWeakMapPolyfill() {
        var UUID_SIZE = 16;
        var keys = HashMap.create();
        var rootKey = CreateUniqueKey();
        return (function () {
            function WeakMap() {
                this._key = CreateUniqueKey();
            }
            WeakMap.prototype.has = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? HashMap.has(table, this._key) : false;
            };
            WeakMap.prototype.get = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? HashMap.get(table, this._key) : undefined;
            };
            WeakMap.prototype.set = function (target, value) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                table[this._key] = value;
                return this;
            };
            WeakMap.prototype.delete = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? delete table[this._key] : false;
            };
            WeakMap.prototype.clear = function () {
                // NOTE: not a real clear, just makes the previous data unreachable
                this._key = CreateUniqueKey();
            };
            return WeakMap;
        }());
        function CreateUniqueKey() {
            var key;
            do
                key = "@@WeakMap@@" + CreateUUID();
            while (HashMap.has(keys, key));
            keys[key] = true;
            return key;
        }
        function GetOrCreateWeakMapTable(target, create) {
            if (!hasOwn.call(target, rootKey)) {
                if (!create)
                    return undefined;
                Object.defineProperty(target, rootKey, { value: HashMap.create() });
            }
            return target[rootKey];
        }
        function FillRandomBytes(buffer, size) {
            for (var i = 0; i < size; ++i)
                buffer[i] = Math.random() * 0xff | 0;
            return buffer;
        }
        function GenRandomBytes(size) {
            if (typeof Uint8Array === "function") {
                if (typeof crypto !== "undefined")
                    return crypto.getRandomValues(new Uint8Array(size));
                if (typeof msCrypto !== "undefined")
                    return msCrypto.getRandomValues(new Uint8Array(size));
                return FillRandomBytes(new Uint8Array(size), size);
            }
            return FillRandomBytes(new Array(size), size);
        }
        function CreateUUID() {
            var data = GenRandomBytes(UUID_SIZE);
            // mark as random - RFC 4122 § 4.4
            data[6] = data[6] & 0x4f | 0x40;
            data[8] = data[8] & 0xbf | 0x80;
            var result = "";
            for (var offset = 0; offset < UUID_SIZE; ++offset) {
                var byte = data[offset];
                if (offset === 4 || offset === 6 || offset === 8)
                    result += "-";
                if (byte < 16)
                    result += "0";
                result += byte.toString(16).toLowerCase();
            }
            return result;
        }
    }
    // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
    function MakeDictionary(obj) {
        obj.__ = undefined;
        delete obj.__;
        return obj;
    }
    // patch global Reflect
    (function (__global) {
        if (typeof __global.Reflect !== "undefined") {
            if (__global.Reflect !== Reflect) {
                for (var p in Reflect) {
                    if (hasOwn.call(Reflect, p)) {
                        __global.Reflect[p] = Reflect[p];
                    }
                }
            }
        }
        else {
            __global.Reflect = Reflect;
        }
    })(typeof global !== "undefined" ? global :
        typeof self !== "undefined" ? self :
            Function("return this;")());
})(Reflect || (Reflect = {}));
//# sourceMappingURL=Reflect.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(107), __webpack_require__(113)))

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(19)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(45);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(46);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(47);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(48);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(49);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(50);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(51);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(52);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(53);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(54);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(55);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(56);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(57);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 102 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMjdBRTYwIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgICA8cGF0aCBkPSJNMTkgNi40MUwxNy41OSA1IDEyIDEwLjU5IDYuNDEgNSA1IDYuNDEgMTAuNTkgMTIgNSAxNy41OSA2LjQxIDE5IDEyIDEzLjQxIDE3LjU5IDE5IDE5IDE3LjU5IDEzLjQxIDEyeiIvPg0KICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz4NCjwvc3ZnPg=="

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

/*eslint-env browser*/

var clientOverlay = document.createElement('div');
clientOverlay.id = 'webpack-hot-middleware-clientOverlay';
var styles = {
  background: 'rgba(0,0,0,0.85)',
  color: '#E8E8E8',
  lineHeight: '1.2',
  whiteSpace: 'pre',
  fontFamily: 'Menlo, Consolas, monospace',
  fontSize: '13px',
  position: 'fixed',
  zIndex: 9999,
  padding: '10px',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflow: 'auto',
  dir: 'ltr',
  textAlign: 'left'
};
for (var key in styles) {
  clientOverlay.style[key] = styles[key];
}

var ansiHTML = __webpack_require__(18);
var colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'E36049',
  green: 'B3CB74',
  yellow: 'FFD080',
  blue: '7CAFC2',
  magenta: '7FACCA',
  cyan: 'C3C2EF',
  lightgrey: 'EBE7E3',
  darkgrey: '6D7891'
};
ansiHTML.setColors(colors);

var Entities = __webpack_require__(58).AllHtmlEntities;
var entities = new Entities();

exports.showProblems =
function showProblems(type, lines) {
  clientOverlay.innerHTML = '';
  lines.forEach(function(msg) {
    msg = ansiHTML(entities.encode(msg));
    var div = document.createElement('div');
    div.style.marginBottom = '26px';
    div.innerHTML = problemType(type) + ' in ' + msg;
    clientOverlay.appendChild(div);
  });
  if (document.body) {
    document.body.appendChild(clientOverlay);
  }
};

exports.clear =
function clear() {
  if (document.body && clientOverlay.parentNode) {
    document.body.removeChild(clientOverlay);
  }
};

var problemColors = {
  errors: colors.red,
  warnings: colors.yellow
};

function problemType (type) {
  var color = problemColors[type] || colors.red;
  return (
    '<span style="background-color:#' + color + '; color:#fff; padding:2px 4px; border-radius: 2px">' +
      type.slice(0, -1).toUpperCase() +
    '</span>'
  );
}


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Based heavily on https://github.com/webpack/webpack/blob/
 *  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
 * Original copyright Tobias Koppers @sokra (MIT license)
 */

/* global window __webpack_hash__ */

if (false) {
  throw new Error("[HMR] Hot Module Replacement is disabled.");
}

var hmrDocsUrl = "http://webpack.github.io/docs/hot-module-replacement-with-webpack.html"; // eslint-disable-line max-len

var lastHash;
var failureStatuses = { abort: 1, fail: 1 };
var applyOptions = { ignoreUnaccepted: true };

function upToDate(hash) {
  if (hash) lastHash = hash;
  return lastHash == __webpack_require__.h();
}

module.exports = function(hash, moduleMap, options) {
  var reload = options.reload;
  if (!upToDate(hash) && module.hot.status() == "idle") {
    if (options.log) console.log("[HMR] Checking for updates on the server...");
    check();
  }

  function check() {
    var cb = function(err, updatedModules) {
      if (err) return handleError(err);

      if(!updatedModules) {
        if (options.warn) {
          console.warn("[HMR] Cannot find update (Full reload needed)");
          console.warn("[HMR] (Probably because of restarting the server)");
        }
        performReload();
        return null;
      }

      var applyCallback = function(applyErr, renewedModules) {
        if (applyErr) return handleError(applyErr);

        if (!upToDate()) check();

        logUpdates(updatedModules, renewedModules);
      };

      var applyResult = module.hot.apply(applyOptions, applyCallback);
      // webpack 2 promise
      if (applyResult && applyResult.then) {
        // HotModuleReplacement.runtime.js refers to the result as `outdatedModules`
        applyResult.then(function(outdatedModules) {
          applyCallback(null, outdatedModules);
        });
        applyResult.catch(applyCallback);
      }

    };

    var result = module.hot.check(false, cb);
    // webpack 2 promise
    if (result && result.then) {
        result.then(function(updatedModules) {
            cb(null, updatedModules);
        });
        result.catch(cb);
    }
  }

  function logUpdates(updatedModules, renewedModules) {
    var unacceptedModules = updatedModules.filter(function(moduleId) {
      return renewedModules && renewedModules.indexOf(moduleId) < 0;
    });

    if(unacceptedModules.length > 0) {
      if (options.warn) {
        console.warn(
          "[HMR] The following modules couldn't be hot updated: " +
          "(Full reload needed)\n" +
          "This is usually because the modules which have changed " +
          "(and their parents) do not know how to hot reload themselves. " +
          "See " + hmrDocsUrl + " for more details."
        );
        unacceptedModules.forEach(function(moduleId) {
          console.warn("[HMR]  - " + moduleMap[moduleId]);
        });
      }
      performReload();
      return;
    }

    if (options.log) {
      if(!renewedModules || renewedModules.length === 0) {
        console.log("[HMR] Nothing hot updated.");
      } else {
        console.log("[HMR] Updated modules:");
        renewedModules.forEach(function(moduleId) {
          console.log("[HMR]  - " + moduleMap[moduleId]);
        });
      }

      if (upToDate()) {
        console.log("[HMR] App is up to date.");
      }
    }
  }

  function handleError(err) {
    if (module.hot.status() in failureStatuses) {
      if (options.warn) {
        console.warn("[HMR] Cannot check for update (Full reload needed)");
        console.warn("[HMR] " + err.stack || err.message);
      }
      performReload();
      return;
    }
    if (options.warn) {
      console.warn("[HMR] Update check failed: " + err.stack || err.message);
    }
  }

  function performReload() {
    if (reload) {
      if (options.warn) console.warn("[HMR] Reloading page");
      window.location.reload();
    }
  }
};


/***/ }),
/* 105 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(0);

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(23);

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(28);

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(40);

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(41);

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(42);

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(47);

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(8);

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(9);

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(16);
__webpack_require__(15);
module.exports = __webpack_require__(14);


/***/ })
/******/ ]);
//# sourceMappingURL=main-client.js.map