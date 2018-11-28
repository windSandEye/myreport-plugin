define(function (require, exports, module) {
	exports.gaugeFinishChartFilter = function (data) {

		var t4_add = 0, total_cnt = 0;

		if (data.result != null) {
			t4_add = data.result['t4_add'];
			total_cnt = data.result['fiscal_year_aau_add_cnt']
		}


		const rtn = {

			result: {
				tooltip: {
					formatter: "{a} <br/>{b} : {c}%"
				},
				series: [
					{
						type: 'gauge',
						detail: {
							formatter: function (value) {
								return "完成率\r\n" + ((total_cnt / 400000000) * 100).toFixed(2) + "%"
							},
							fontSize: 15,
							color: '#666666'
						},
						data: [{ value: getNode(t4_add) }]
						, axisLine: {
							show: true,
							lineStyle: {
								width: 20,
								shadowBlur: 0,
								color: [
									[0.7, '#1890FF'],
									[1, '#F0F2F5']
								]
							},

						}, axisLabel: {
							formatter: function (e) {
								switch (e + "") {
									case "10":
										return "差";
									case "30":
										return "中";
									case "60":
										return "良";
									case "90":
										return "优";
									default:
										return "";
								}
							},
							textStyle: {
								fontSize: 15,
								fontWeight: ""
							}
						}
					}
				]
			},
			status: 'success'

		};
		return rtn;
	};

	function getNode(t4_add) {
		if (t4_add <= 0) {
			return 0;
		}
		value = (t4_add - 400000) / 400000;
		if (value > 0.2) {
			return 95;
		} else if (value < 0.2 && value > 0.1) {
			return 80;
		} else if (value == 0.1) {
			return 40;
		} else {
			return 5;
		}

	}


	exports.gaugeAlertChartFilter = function (data) {

		var t4_add = 0, lost_cnt = 0;

		if (data.result != null) {
			t4_add = data.result['t4_add'];
			lost_cnt = data.result['lost_cnt']
		}

		const rtn = {

			result: {
				tooltip: {
					formatter: "{a} <br/>{b} : {c}%"
				},
				series: [
					{
						type: 'gauge',
						detail: {
							formatter: function (value) {
								return "流失用户数\r\n" + lost_cnt//data.result.lost_cnt
							},
							fontSize: 15,
							color: '#666666'
						},
						data: [{ value: getLostValue(lost_cnt, t4_add) }]
						, axisLine: {
							show: true,
							lineStyle: {
								width: 20,
								shadowBlur: 0,
								color: [
									[0.7, '#1890FF'],
									[1, '#F0F2F5']
								]
							},

						}, axisLabel: {
							formatter: function (e) {
								switch (e + "") {
									case "10":
										return "差";
									case "30":
										return "中";
									case "60":
										return "良";
									case "90":
										return "优";
									default:
										return "";
								}
							},
							textStyle: {
								fontSize: 15,
								fontWeight: ""
							}
						}
					}
				]
			},
			status: 'success'

		};
		return rtn;
	};

	function getLostValue(lost_cnt, t4_add) {
		value = lost_cnt / t4_add;
		if (value < 0.05) {
			return 95;
		} else if (value > 0.05 && value < 0.01) {
			return 80;
		} else if (value > 0.1 && value < 0.2) {
			return 45;
		} else {
			return 5;
		}
	}

	//支付能力树Filter
	exports.canvasTreeFilter = function (data) {
		const rtn = {
			result: {
				data: data.result
			},
			status: 'success'
		};
		return rtn;
	};

	//用户注册表Filter
	exports.registerTableFilter = function (data) {
		var result = data.result;
		var tableList = [];
		//封装每行数据
		for (var i = 0; i < 5; i++) {
			var row = [];
			if (result && result.length > 0) {
				for (var j = 0; j < result.length; j++) {
					if (result[j].pay_ability_yesterday == i) {
						row.push(result[j]);
					}
				}
			}

			var tableRow = { title: "T" + i };
			for (var m = 4; m > -1; m--) {
				var count = findCell(row, m);
				tableRow["t" + m + "_register"] = count ? count : 0;
			}
			//列合并
			tableRow.t01_register = tableRow.t0_register * 1 + tableRow.t1_register * 1;
			tableList.push(tableRow);
		}

		//行合并
		var row0 = tableList[0];
		var row1 = tableList[1];
		tableList.splice(0, 2);
		tableList.unshift({
			title: "T0/1",
			t4_register: row0.t4_register * 1 + row1.t4_register * 1,
			t3_register: row0.t3_register * 1 + row1.t3_register * 1,
			t2_register: row0.t2_register * 1 + row1.t2_register * 1,
			t01_register: row0.t01_register * 1 + row1.t01_register * 1
		})


		//总计
		var sumObj = {
			title: "总计",
			t4_register: 0,
			t3_register: 0,
			t2_register: 0,
			t1_register: 0,
			t0_register: 0,
			t01_register: 0
		}
		for (var y = 0; y < tableList.length; y++) {
			if (tableList[y].t4_register) {
				sumObj.t4_register += parseInt(tableList[y].t4_register);
			}
			if (tableList[y].t3_register) {
				sumObj.t3_register += parseInt(tableList[y].t3_register);
			}
			if (tableList[y].t2_register) {
				sumObj.t2_register += parseInt(tableList[y].t2_register);
			}
			if (tableList[y].t1_register) {
				sumObj.t1_register += parseInt(tableList[y].t1_register);
			}
			if (tableList[y].t0_register) {
				sumObj.t0_register += parseInt(tableList[y].t0_register);
			}
			if (tableList[y].t01_register) {
				sumObj.t01_register += parseInt(tableList[y].t01_register);
			}
		}
		//对0处理为null
		sumObj.t4_register = sumObj.t4_register;
		sumObj.t3_register = sumObj.t3_register;
		sumObj.t2_register = sumObj.t2_register;
		sumObj.t1_register = sumObj.t1_register;
		sumObj.t0_register = sumObj.t0_register;
		sumObj.t01_register = sumObj.t01_register;
		tableList.push(sumObj);

		//将0处理为null
		for (var n = 0; n < tableList.length; n++) {
			if (tableList[n].t4_register == 0) {
				tableList[n].t4_register = null
			}
			if (tableList[n].t3_register == 0) {
				tableList[n].t3_register = null
			}
			if (tableList[n].t2_register == 0) {
				tableList[n].t2_register = null
			}
			if (tableList[n].t01_register == 0) {
				tableList[n].t01_register = null
			}
		}

		const rtn = {
			result: tableList,
			status: 'success'
		};
		return rtn;
	};

	function findCell(row, index) {
		for (var x = 0; x < row.length; x++) {
			if (row[x].pay_ability_today == index) {
				return row[x].usercount;
			}
		}
		return null;
	}

	exports.polymerizationFilter = function (key) {
		if (key == "all") {
			return JSON.stringify({
				polymericName: "all",
				polymericSource: "all"
			})
		} else if (key == "tbNewResultPage") {
			return JSON.stringify({
				polymericName: null,
				polymericSource: "tbNewResultPage"
			})
		} else {
			return JSON.stringify({
				polymericName: null,
				polymericSource: "openPaymentCode"
			})
		}
	}

	exports.paymentLevelChangeFilter = function (response) {
		let result = response[0] ? response[0].result : null;
		let sumResult = response[1] ? response[1].result : null;
		var tableData = [];
		if (!result) {
			return {
				result: tableData,
				status: 'success'
			}
		}
		let column = ["T4", "T3", "T2", "T0/1", "注册"]
		for (let col of column) {
			let row = createLevelRow(col);
			switch (col) {
				case "T4":
					row.userCntFrom = result.pay_ability_4_add;
					row.userCntLost = result.pay_ability_4_lost;
					row.userCntAdd = result.pay_ability_4_add * 1 - result.pay_ability_4_lost * 1;
					if (sumResult) {
						let history4 = sumResult.find(item => item.pay_ability_today == "4");
						row.userCntHistory = history4 && history4.user_cnt_total ? history4.user_cnt_total : 0;
					} else {
						row.userCntHistory = 0;
					}
					break;
				case "T3":
					row.userCntFrom = result.pay_ability_3_add;
					row.userCntLost = result.pay_ability_3_lost;
					row.userCntAdd = result.pay_ability_3_add * 1 - result.pay_ability_3_lost * 1;
					if (sumResult) {
						let history3 = sumResult.find(item => item.pay_ability_today == "3");
						row.userCntHistory = history3 && history3.user_cnt_total ? history3.user_cnt_total : 0;
					} else {
						row.userCntHistory = 0;
					}
					break;
				case "T2":
					row.userCntFrom = result.pay_ability_2_add;
					row.userCntLost = result.pay_ability_2_lost;
					row.userCntAdd = result.pay_ability_2_add * 1 - result.pay_ability_2_lost * 1;
					if (sumResult) {
						let history2 = sumResult.find(item => item.pay_ability_today == "2");
						row.userCntHistory = history2 && history2.user_cnt_total ? history2.user_cnt_total : 0;
					} else {
						row.userCntHistory = 0;
					}
					break;
				case "T0/1":
					row.userCntFrom = result.pay_ability_1and0_add;
					row.userCntLost = result.pay_ability_1and0_lost;
					row.userCntAdd = result.pay_ability_1and0_add * 1 - result.pay_ability_1and0_lost * 1;
					if (sumResult) {
						let history01 = sumResult.filter(
							item => item.pay_ability_today == "0" || item.pay_ability_today == "1" || item.pay_ability_today == "-1");
						if (history01 && history01.length > 0) {
							row.userCntHistory = history01.reduce((prev, cur) => {
								let user_cnt_total = cur.user_cnt_total ? cur.user_cnt_total*1 : 0;
								return prev + user_cnt_total;
							}, 0)
						} else {
							row.userCntHistory = 0;
						}
					} else {
						row.userCntHistory = 0;
					}
					break;
				case "注册":
					row.userCntFrom = result.register_add;
					row.userCntLost = null;
					row.userCntAdd = result.register_add;
					if (sumResult) {
						let historyRegister = sumResult.find(item => item.pay_ability_today == "注册");
						row.userCntHistory = historyRegister && historyRegister.user_cnt_total ? historyRegister.user_cnt_total : 0;
					} else {
						row.userCntHistory = 0;
					}
					break;
			}
			tableData.push(row)
		}

		return {
			result: tableData,
			status: 'success'
		}

	}

	function createLevelRow(level) {
		var row = {
			level: level,
			userCntFrom: null,
			userCntLost: null,
			userCntAdd: null
		}
		return row;
	}




	//支付能力变更弹窗
	exports.showLevelModal = function (event, title, level) {
		var searchLevel = level;
		if (level == "T0/T1") {
			searchLevel = "0和1"
		} else if (level == "注册") {
			searchLevel = "注册"
		} else {
			searchLevel = level.substring(1);
		}
		return JSON.stringify(
			{
				'T.showTrend': true,
				'T.trendTitle': level + title + "趋势变化",
				'T.level': searchLevel,
				'T.trendType': title
			}
		)

	}

	//支付能力跃迁
	exports.paymentChangeFilter = function (response) {
		var tableData = [];
		if (!response.result) {
			return {
				result: {
					data: []
				},
				status: 'success'
			}
		}
		var resultData = response.result;
		var initLevelList = ['注册', '0/1', '2', '3', '4'];
		for (var i = 0; i < initLevelList.length; i++) {
			var group = changeLevelRow(resultData, initLevelList[i]);
			var regist_cnt = group.reduce((prev, cur) => {
				if (cur.user_cnt) {
					return prev + parseInt(cur.user_cnt);
				} else {
					return prev;
				}
			}, 0);
			//遍历设置初始值
			initUserCnt(group, regist_cnt, tableData);
		}

		return {
			result: {
				data: tableData,
			},
			status: 'success'
		}

	}

	//初始值设置
	function initUserCnt(list, initCnt, tableList) {
		for (var i = 0; i < list.length; i++) {
			list[i].userCntInt = initCnt;
			tableList.push(list[i]);
		}
	}


	//01特殊处理
	function deal01(data0, data1, data_1) {
		var obj01 = {}
		let cnt0 = 0, cnt1 = 0, cnt_1 = 0;
		if (data0) {
			cnt0 = data0.user_cnt
		}
		if (data1) {
			cnt1 = data1.user_cnt
		}
		if (data_1) {
			cnt_1 = data_1.user_cnt
		}
		obj01.user_cnt = cnt0 * 1 + cnt1 * 1 + cnt_1 * 1;
		return obj01;
	}

	//跃迁行
	function changeLevelRow(list, init) {
		var groupList = [];
		var changeLevelList = ['0/1', '2', '3', '4'];
		for (var i = 0; i < changeLevelList.length; i++) {
			if (init == "0/1" && changeLevelList[i] != "0/1") {
				var init0 = findItem(list, 0, changeLevelList[i]);
				var init1 = findItem(list, 1, changeLevelList[i]);
				var init_1 = findItem(list, -1, changeLevelList[i]);
				var init01_cnt = deal01(init0, init1, init_1);
				var init01 = {
					pay_ability_yesterday: "0/1",
					pay_ability_today: changeLevelList[i],
					user_cnt: init01_cnt.user_cnt != 0 ? init01_cnt.user_cnt : null
				}
				groupList.push(init01)
			} else {
				if (init != changeLevelList[i]) {
					if (changeLevelList[i] == '0/1') {
						var item0 = findItem(list, init, 0);
						var item1 = findItem(list, init, 1);
						var item_1 = findItem(list, init, -1);
						var item01_cnt = deal01(item0, item1, item_1);
						var item01 = {
							pay_ability_yesterday: init,
							pay_ability_today: '0/1',
							user_cnt: item01_cnt.user_cnt != 0 ? item01_cnt.user_cnt : null
						}
						groupList.push(item01)
					} else {
						var item = findItem(list, init, changeLevelList[i]);
						var itemObj = {
							pay_ability_yesterday: init,
							pay_ability_today: changeLevelList[i],
							user_cnt: item ? item.user_cnt : null
						}
						groupList.push(itemObj)
					}
				}
			}

		}
		return groupList
	}

	//查找对应的数据
	function findItem(list, init, change) {
		for (var i = 0; i < list.length; i++) {
			if (list[i].pay_ability_yesterday == init && list[i].pay_ability_today == change) {
				return list[i];
			}
		}
		return null;
	}

});



