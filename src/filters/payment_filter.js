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
			for (var j = 0; j < result.length; j++) {
				if (result[j].pay_ability_yesterday == i) {
					row.push(result[j]);
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

});



