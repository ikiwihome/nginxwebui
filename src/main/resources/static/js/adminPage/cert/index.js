$(function() {
	form.on('switch(autoRenew)', function(data) {
		$.ajax({
			type: 'POST',
			url: ctx + '/adminPage/cert/setAutoRenew',
			data: {
				id: data.value,
				autoRenew: data.elem.checked ? 1 : 0
			},
			dataType: 'json',
			success: function(data) {

				if (data.success) {
					//location.reload();
				} else {
					layer.msg(data.msg);
				}
			},
			error: function() {
				layer.alert(commonStr.errorInfo);
			}
		});
	});

	layui.use('upload', function() {
		var upload = layui.upload;
		upload.render({
			elem: '#pemBtn',
			url: '/adminPage/main/upload',
			accept: 'file',
			done: function(res) {
				// 上传完毕回调
				if (res.success) {
					$("#pem").val(res.obj);
					var path = res.obj.split('/');
					$("#pemPath").html(path[path.length - 1]);
				}

			},
			error: function() {
				// 请求异常回调
			}
		});

		upload.render({
			elem: '#keyBtn',
			url: '/adminPage/main/upload',
			accept: 'file',
			done: function(res) {
				// 上传完毕回调
				if (res.success) {
					$("#key").val(res.obj);
					var path = res.obj.split('/');
					$("#keyPath").html(path[path.length - 1]);
				}
			},
			error: function() {
				// 请求异常回调
			}
		});
	});
	
	
	layui.use('laydate', function() {
		layui.laydate.render({
			elem: '#makeTime, #endTime',
			type: 'datetime',
			format: 'yyyy-MM-dd HH:mm:ss'
		});
	})

	layui.use('util', function() {

	});

	form.on('select(dnsType)', function(data) {
		checkDnsType(data.value);
	});


	form.on('select(type)', function(data) {
		checkType(data.value);
	});
	
	form.on('checkbox(checkAll)', function(data) {
		if (data.elem.checked) {
			$("input[name='ids']").prop("checked", true)
		} else {
			$("input[name='ids']").prop("checked", false)
		}

		form.render();
	});	
})

function search() {
	$("input[name='curr']").val(1);
	$("#searchForm").submit();
}

function checkDnsType(value) {
	$("#ali").hide();
	$("#dp").hide();
	$("#tencent").hide();
	$("#aws").hide();
	$("#cf").hide();
	$("#gd").hide();
	$("#hw").hide();
	$("#ipv64").hide();
	
	$("#" + value).show();
}

function checkType(value) {
	$("#type0").hide();
	$("#type1").hide();
	$("#encryptionDiv").hide();

	if (value == 0) {
		$("#type0").show();
		$("#encryptionDiv").show();
	}
	if (value == 1) {
		$("#type1").show();
	}

	if (value == 2) {
		$("#encryptionDiv").show();
	}
}

function add() {
	$("#id").val("");
	$("#domain").val("");
	$("#type option:first").prop("selected", true);
	$("#dnsType option:first").prop("selected", true);
	$("#encryption option:first").prop("selected", true);
	$("#aliKey").val("");
	$("#aliSecret").val("");
	$("#dpId").val("");
	$("#dpKey").val("");
	$("#tencentSecretId").val("");
	$("#tencentSecretKey").val("");
	$("#awsAccessKeyId").val("");
	$("#awsSecretAccessKey").val("");
	$("#cfEmail").val("");
	$("#cfKey").val("");
	$("#gdKey").val("");
	$("#gdSecret").val("");
	$("#ipv64Token").val("");
	
	$("#hwUsername").val("");
	$("#hwPassword").val("");
	$("#hwDomainName").val("");

	$("#pem").val("");
	$("#key").val("");
	$("#pemPath").html("");
	$("#keyPath").html("");

	$("#domain").attr("disabled", false);
	$("#domain").removeClass("disabled");
	$("#type").attr("disabled", false);
	$("#encryption").attr("disabled", false);
	$("#encryption").removeClass("disabled");

	$("#makeTime").val("");
	$("#endTime").val("");

	checkType(2);
	checkDnsType('ali');

	form.render();
	showWindow(certStr.add);
}



function edit(id, clone) {
	$("#id").val(id);


	$.ajax({
		type: 'GET',
		url: ctx + '/adminPage/cert/detail',
		dataType: 'json',
		data: {
			id: id
		},
		success: function(data) {
			if (data.success) {

				var cert = data.obj;

				$("#domain").val(cert.domain);
				$("#type").val(cert.type);
				$("#dnsType").val(cert.dnsType != null ? cert.dnsType : 'ali');
				$("#encryption").val(cert.encryption != null ? cert.encryption : 'RSA');
				$("#aliKey").val(cert.aliKey);
				$("#aliSecret").val(cert.aliSecret);
				$("#dpId").val(cert.dpId);
				$("#dpKey").val(cert.dpKey);
				$("#tencentSecretId").val(cert.tencentSecretId);
				$("#tencentSecretKey").val(cert.tencentSecretKey);
				$("#awsAccessKeyId").val(cert.awsAccessKeyId);
				$("#awsSecretAccessKey").val(cert.awsSecretAccessKey);
				$("#cfEmail").val(cert.cfEmail);
				$("#cfKey").val(cert.cfKey);

				$("#gdKey").val(cert.gdKey);
				$("#gdSecret").val(cert.gdSecret);
				$("#ipv64Token").val(cert.ipv64Token);
				
				$("#hwUsername").val(cert.hwUsername);
				$("#hwPassword").val(cert.hwPassword);
				$("#hwDomainName").val(cert.hwDomainName);

				if (!clone) {
					$("#domain").attr("disabled", true);
					$("#domain").addClass("disabled");

					if (cert.pem != null && cert.pem != '' && cert.key != null && cert.key != '') {
						$("#type").attr("disabled", true);
						$("#encryption").attr("disabled", true);
						$("#encryption").addClass("disabled");
					} else {
						$("#type").attr("disabled", false);
						$("#encryption").attr("disabled", false);
						$("#encryption").removeClass("disabled");
					}

					$("#id").val(cert.id);
					$("#pem").val(cert.pem);
					$("#key").val(cert.key);
					var path = cert.pem.split('/');
					$("#pemPath").html(path[path.length - 1]);
					path = cert.key.split('/');
					$("#keyPath").html(path[path.length - 1]);

					if (cert.makeTime != null) {
						$("#makeTime").val(layui.util.toDateString(cert.makeTime, 'yyyy-MM-dd HH:mm:ss'));
					}
					if (cert.endTime != null) {
						$("#endTime").val(layui.util.toDateString(cert.endTime, 'yyyy-MM-dd HH:mm:ss'));
					}
				} else {
					$("#domain").attr("disabled", false);
					$("#domain").removeClass("disabled");
					$("#encryption").attr("disabled", false);
					$("#encryption").removeClass("disabled");
					$("#type").attr("disabled", false);

					$("#id").val("");
					$("#pem").val("");
					$("#key").val("");
					$("#pemPath").html("");
					$("#keyPath").html("");
					$("#makeTime").val("");
					$("#endTime").val("");
				}

				checkType(cert.type);
				checkDnsType(cert.dnsType != null ? cert.dnsType : 'ali');

				form.render();
				showWindow(certStr.edit);

			} else {
				layer.msg(data.msg);
			}
		},
		error: function() {
			layer.alert(commonStr.errorInfo);
		}
	});
}

function showWindow(title) {
	layer.open({
		type: 1,
		title: title,
		area: ['1000px', '630px'], // 宽高
		content: $('#windowDiv')
	});
}

function addOver() {
	if ($("#domain").val() == "") {
		layer.msg(certStr.error1);
		return;
	}

	if ($("#type").val() == 0) {
		if ($("#dnsType").val() == 'ali') {
			if ($("#aliKey").val() == '' || $("#aliSecret").val() == '') {
				layer.msg(commonStr.IncompleteEntry);
				return;
			}
		}
		if ($("#dnsType").val() == 'dp') {
			if ($("#dpId").val() == '' || $("#dpKey").val() == '') {
				layer.msg(commonStr.IncompleteEntry);
				return;
			}
		}
		if ($("#dnsType").val() == 'cf') {
			if ($("#cfEmail").val() == '' || $("#cfKey").val() == '') {
				layer.msg(commonStr.IncompleteEntry);
				return;
			}
		}
		if ($("#dnsType").val() == 'gd') {
			if ($("#gdKey").val() == '' || $("#gdSecret").val() == '') {
				layer.msg(commonStr.IncompleteEntry);
				return;
			}
		}
		if ($("#dnsType").val() == 'hw') {
			if ($("#hwUsername").val() == '' || $("#hwPassword").val() == '' || $("#hwDomainName").val() == '') {
				layer.msg(commonStr.IncompleteEntry);
				return;
			}
		}
		if ($("#dnsType").val() == 'aws') {
			if ($("#awsAccessKeyId").val() == '' || $("#awsSecretAccessKey").val() == '') {
				layer.msg(commonStr.IncompleteEntry);
				return;
			}
		}
		if ($("#dnsType").val() == 'ipv64') {
			if ($("#ipv64Token").val() == '') {
				layer.msg(commonStr.IncompleteEntry);
				return;
			}
		}
	}

	if ($("#type").val() == 1 && $("#pem").val() == $("#key").val()) {
		layer.msg(certStr.error5);
		return;
	}

	// 将时间字段的值转换为时间戳
	if ($("#makeTime").val() !== '') {
		$("#makeTime").val(new Date($("#makeTime").val()).getTime());
	}
	if ($("#endTime").val() !== '') {
		$("#endTime").val(new Date($("#endTime").val()).getTime());
	}

	$.ajax({
		type: 'POST',
		url: ctx + '/adminPage/cert/addOver',
		data: $('#addForm').serialize(),
		dataType: 'json',
		success: function(data) {

			if (data.success) {
				location.reload();
			} else {
				layer.msg(data.msg);
			}
		},
		error: function() {
			layer.alert(commonStr.errorInfo);
		}
	});
}


function del(id) {
	if (confirm(commonStr.confirmDel)) {
		$.ajax({
			type: 'POST',
			url: ctx + '/adminPage/cert/del',
			data: {
				id: id
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					location.reload();
				} else {
					layer.msg(data.msg)
				}
			},
			error: function() {
				layer.alert(commonStr.errorInfo);
			}
		});
	}
}



function delMany() {
	if (confirm(commonStr.confirmDel)) {
		var ids = [];

		$("input[name='ids']").each(function() {
			if ($(this).prop("checked")) {
				ids.push($(this).val());
			}
		})

		if (ids.length == 0) {
			layer.msg(commonStr.unselected);
			return;
		}

		$.ajax({
			type: 'POST',
			url : ctx + '/adminPage/cert/del',
			data: {
				id: ids.join(",")
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					location.reload();
				} else {
					layer.msg(data.msg)
				}
			},
			error: function() {
				layer.alert("请求失败，请刷新重试");
			}
		});
	}
}

function issue(id) {

	if (confirm(certStr.confirm1)) {
		layer.load();
		$.ajax({
			type: 'POST',
			url: ctx + '/adminPage/cert/apply',
			data: {
				id: id,
				type: "issue"
			},
			dataType: 'json',
			success: function(data) {
				layer.closeAll();
				if (data.success) {
					if (data.obj == null) {
						layer.alert(certStr.applySuccess, function(index) {
							layer.close(index);
							location.reload();
						});
					} else {
						var html = ``;
						for (let i = 0; i < data.obj.length; i++) {
							var map = data.obj[i]
							html += `
								<tr>
									<td>${map.domain} <input type="hidden" name="domains" value="${map.domain}"> </td>
									<td>${map.type} <input type="hidden" name="types" value="${map.type}"> </td>
									<td>${map.value} <input type="hidden" name="values" value="${map.value}"> </td>
								</tr>
							`;
						}
						$("#notice").html(html);

						layer.open({
							type: 1,
							title: certStr.hostRecords,
							area: ['900px', '400px'], // 宽高
							content: $('#txtDiv')
						});

					}

				} else {
					layer.open({
						type: 0,
						area: ['810px', '400px'],
						content: data.msg
					});
				}
			},
			error: function() {
				layer.closeAll();
				layer.alert(commonStr.errorInfo);
			}
		});
	}
}


function renew(id) {

	if (confirm(certStr.confirm2)) {
		layer.load();
		$.ajax({
			type: 'POST',
			url: ctx + '/adminPage/cert/apply',
			data: {
				id: id,
				type: "renew"
			},
			dataType: 'json',
			success: function(data) {
				layer.closeAll();
				if (data.success) {
					layer.alert(certStr.renewSuccess, function(index) {
						layer.close(index);
						location.reload();
					});
				} else {
					layer.open({
						type: 0,
						area: ['810px', '400px'],
						content: data.msg
					});
				}
			},
			error: function() {
				layer.closeAll();
				layer.alert(commonStr.errorInfo);
			}
		});
	}
}


function selectPem() {
	rootSelect.selectOne(function(rs) {
		$("#pem").val(rs);
		$("#pemPath").html(rs);
	})
}


function selectKey() {
	rootSelect.selectOne(function(rs) {
		$("#key").val(rs);
		$("#keyPath").html(rs);
	})
}

function download(id) {
	window.open(ctx + "/adminPage/cert/download?id=" + id);
}

function clone(id) {
	if (confirm(serverStr.confirmClone)) {
		edit(id, true);
	}
}




function getTxtValue(id) {
	if (confirm(certStr.hostRecords)) {
		showLoad();
		$.ajax({
			type: 'POST',
			url: ctx + '/adminPage/cert/getTxtValue',
			data: {
				id: id
			},
			dataType: 'json',
			success: function(data) {
				closeLoad();
				if (data.success) {
					var html = ``;

					for (let i = 0; i < data.obj.length; i++) {
						var map = data.obj[i]
						html += `
						<tr>
							<td>${map.domain}</td>
							<td>${map.type}</td>
							<td>${map.value}</td>
						</tr>
					`;
					}

					$("#notice").html(html);

					layer.open({
						type: 1,
						title: certStr.hostRecords,
						area: ['900px', '400px'], // 宽高
						content: $('#txtDiv')
					});
				} else {
					layer.alert(data.msg);
				}
			},
			error: function() {
				layer.closeAll();
				layer.alert(commonStr.errorInfo);
			}
		});
	}
}
