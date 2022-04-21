import  cityUtil from './city'

let JsonData = (function () {
//城市的json数据
  let areaData=cityUtil
//省
  let  provinceData=[];
//市
  let  cityData={};
//县
  let  countyData={};

//循环读取城市json数据
  for(var i in areaData){
    //给省赋值，数组类型
    provinceData.push(areaData[i].name);
    //定义一个数组存所有的省对应的市的值
    let cityValue=[];
    //循环读取所有省的市
    for(var j in areaData[i].children){
      cityValue.push(areaData[i].children[j].name);//取到所有的市
      let cityChildren=areaData[i].children[j].children;//所有市的县
      //定义一个数组存所有的市对应的县的值
      let countyValue=[];
      // //循环读取所有市的县
      for(var k in cityChildren){
        countyValue.push(cityChildren[k].name);//取到所有的县
      }
      //给县赋值，对象类型
      countyData[areaData[i].children[j].name]=countyValue;
    }
    //给市赋值，对象类型
    cityData[areaData[i].name]=cityValue;
  }
  let obj=new Object();
  obj.provinceData=provinceData;
  obj.cityData=cityData;
  obj.countyData=countyData;
  return obj;
}())

module.exports = JsonData
