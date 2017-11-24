const itemsAll = require('./items');
const prmotionsAll = require('./promotions');
module.exports = function bestCharge(inputs) {
	var allItems = itemsAll(); //商品库
	var promotions = prmotionsAll(); //商品优惠活动
	var countItems = computeCount(inputs,allItems);
	var inputItems = countItemsToInputItems(countItems,allItems);//购物清单根据这个显示
	var text = print(inputItems,promotions);//打印购物清单
//	console.log(text);
	return text;
};

function computeCount(inputs){
	var res = [];
	for (var index = 0; index < inputs.length ;index++ )
	{
		var object = new Object();
		inputs[index] = inputs[index].replace(/\s/g,"");
		var temp = inputs[index].split('x');
		object.id = temp[0];
		object.count = parseInt(temp[1]);
		res.push(object);
	}
	return res;
}

function countItemsToInputItems(countItems,allItems){
	countItems.forEach(function(ele){
		allItems.forEach(function(value){
			if(ele.id == value.id){
				ele.name = value.name;
				ele.price = value.price;
			}
		});
	});
	return countItems;
}

function print(inputItems, promotions){
	var sumPrice = 0;
	inputItems.forEach(function (ele){
		sumPrice += ele.price*ele.count;
	});
	//第一种优惠
	var oneProPrice = onePromotion(sumPrice);
	//第二种优惠
	var twoProPrice = twoPromotion(inputItems, promotions[1]);
	var text = "============= 订餐明细 =============\n";
	inputItems.forEach(function(ele){
		text = text + ele.name+" x "+ele.count+" = "+ele.price*ele.count+"元\n";
	});
	if(oneProPrice > 0 || twoProPrice > 0){
		text = text +"-----------------------------------\n使用优惠:\n";
		if(oneProPrice >= twoProPrice){
			text = text + promotions[0].type+"，省"+oneProPrice+"元\n";
			text = text + '-----------------------------------\n总计：'+(sumPrice-oneProPrice)+'元\n'+'===================================';
		}else{
			text = text + "指定菜品半价(";
			inputItems.forEach(function(ele){
				if(ele.half == 1){
					text = text +ele.name+"，";
				}
			});
			text = text.substring(0,text.length-1) + ")，省"+twoProPrice+"元\n";
			text = text + '-----------------------------------\n总计：'+(sumPrice-twoProPrice)+'元\n'+'===================================';
		}
	}else{
		text = text + '-----------------------------------\n总计：'+sumPrice+'元\n'+'===================================';
	}
	
	return text;
}

function onePromotion(sum){
	if(sum >= 30){
		return parseInt(sum / 30) * 6;
	}else{
		return 0;
	}
}

function twoPromotion(inputItems, promotions){
	var sum = 0;
	inputItems.forEach(function (ele){
		promotions.items.forEach(function (value){
			if(ele.id == value){
				ele.half = 1;
				sum += parseInt(ele.price / 2) * ele.count;
			}
		});
		if(ele.half != 1){
			ele.half = 0;
		}
	});
	return sum;
}
