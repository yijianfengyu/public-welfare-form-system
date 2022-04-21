//PI List首页关于 GP和Shipping weight的计算
export function calPiOuter(pi, piItemList, exchange) {
  let shippingWeight = 0;
  let profit = 0;
  if (piItemList.length != 0 && piItemList != null) {
    let exchange1 = JSON.parse(JSON.stringify(exchange))
    let exchangeRate = exchange1[pi.currency.toLocaleLowerCase() + ""]
    for (let i in piItemList) {

      let sp = Number(piItemList[i].sp) * exchangeRate;
      if(sp == 0){

      }else{
        let upExchange = Number(exchange1[piItemList[i].priceType.toLocaleLowerCase() + ""]);
        let up = Number(piItemList[i].up) * upExchange;
        shippingWeight += Number(piItemList[i].totalWeight);
        profit += (sp - up) * Number(piItemList[i].qty).toFixed(4);
      }
    }
  }
  let text = []
  text.push(shippingWeight.toFixed(4))
  text.push(profit.toFixed(4))
  return text
}

//PI List点击事件关于Unit GP的计算
export function calPiItemUnitGp(pis, piItem, exchange) {
  let text = ""
  let exchange1 = JSON.parse(JSON.stringify(exchange))
  let exchangeRate = exchange1[pis.currency.toLocaleLowerCase() + ""]
  let sp = Number(piItem.sp) * exchangeRate;
  if (sp == 0 || piItem.up == 0 || sp == undefined || piItem.up == undefined) {
    text = "0.0000%";
  } else {
    let upExchange = Number(exchange1[piItem.priceType.toLocaleLowerCase() + ""]);
    let up = Number(piItem.up) * upExchange;
    text = (((sp - up) / up) * 100).toFixed(4) + "%";
  }
  return text
}

//PO Approval首页关于 profit和weight的计算
export function calPoAppOuter(currentPo, poItemList, exchange) {
  let weight = 0;
  let profit = 0;

  if (poItemList.length != 0 && poItemList != null) {
    let po = JSON.parse(JSON.stringify(currentPo))
    let exchangeRate = po["exchange" + po.currency]

    for (let i in poItemList) {
      let sp = Number(poItemList[i].sp) * exchangeRate;
      let qty = Number(poItemList[i].qty)
      weight += Number(poItemList[i].totalWeight)
      let upExchange = po["exchange" + poItemList[i].upPriceType]
      let up = Number(poItemList[i].up) * Number(upExchange);
      profit += (sp - up) * qty;
    }
  }
  let text = []
  text.push(profit.toFixed(4))
  text.push(weight.toFixed(4))
  return text
}

//PO Approval点击事件关于Unit GP的计算
export function calPoAppItemUnitGp(currentPo, poItem) {
  let text = ""
  let po = JSON.parse(JSON.stringify(currentPo))
  let exchange1 = po["exchange" + currentPo.currency]
  if (poItem.qty > 0) {
    let sp = Number((poItem.sp)) * Number(exchange1);
    let qty = Number(poItem.qty)
    if (sp == 0 || qty == 0) {
      text = "0.0000%"
    } else {
      let upExchange = po["exchange" + poItem.upPriceType]
      var up = Number(poItem.up) * Number(upExchange);
      text = (((sp - up) / up) * 100).toFixed(4) + "%";
    }
  }
  return text
}

//PO List点击事件关于Unit GP的计算
export function calPoItemUnitGp(currentPo, poItem) {
  let text = ""
  let po = JSON.parse(JSON.stringify(currentPo))
  let exchange1 = po["exchange" + currentPo.currency]
  if (poItem.qty > 0 && poItem.up!=0) {
    let sp = Number((poItem.sp)) * Number(exchange1);
    if (sp == 0) {
      text = "0.0000%"
    } else {
      let upExchange = po["exchange" + poItem.upPriceType]
      var up = Number(poItem.up) * Number(upExchange);
      text = (((sp - up) / up) * 100).toFixed(4) + "%";
    }
  }
  return text
}




