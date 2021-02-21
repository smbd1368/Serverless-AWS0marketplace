const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const fileType = require('file-type');
var uniqueFilename = require('unique-filename')
const { Client } = require('@elastic/elasticsearch');

// const client = new Client({ node: 'https://search-productdata-gewson6zruy7khdgnogwvy5jha.ap-southeast-2.es.amazonaws.com' });
const client = new Client({ node: 'https://vpc-uat-mp-db-idsrwibpn43v2yjzmote3nhcte.ap-southeast-2.es.amazonaws.com' });
'use strict';
const resultoo = [
    {
     apikey: "a76aceb1d1236f5180ea91c757140a5f",
     referer: "all",
       dashboarduser:"all",
       dashboardpass:"all",
       search : [{
         cats : [1,2,3,4],
         stores : [1,2,3,4]
       }]
   },
   {
     apikey: "be6e60386ffd7bfe65a0f942cf0244a4",
     referer: "bundll.com",
       dashboarduser:"bundll",
       dashboardpass:"bundll",
       search : [{
         cats : [1,2,3,4],
         stores : [1,2,3,4]
       }]
   },            
   {
     apikey: "6b9369098e45f23b27c468e2e996dd46",
     referer: "humm.com",
       dashboarduser:"humm",
       dashboardpass:"humm",
       search : [{
         cats : [1,2,3,4],
         stores : [1,2,3,4]
       }]
   },
   {
     apikey: "f26234404842fe4735597fdbb130b465",
     referer: "humm90.com",
       dashboarduser:"humm90",
       dashboardpass:"humm90",
       search : [{
         cats : [1,2,3,4],
         stores : [1,2,3,4]
       }]
   },
   {
     apikey: "a1e9475b8a660b0412b69d534f20eb18",
     referer: "hummpro.com",
       dashboarduser:"hummpro",
       dashboardpass:"hummpro",
       search : [{
         cats : [1,2,3,4],
         stores : [1,2,3,4]
       }]
   }
];
// start global functions
function isEmpty(obj) {
  for(var key in obj) {

     if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}
var change = 123;
function cut_fields(fields, ret_data)
{
var ret_data_cut = {}
var no_var = 1;
for(var i = 0; i < fields.length; i++)
{

if (fields[i] in ret_data)
{
   ret_data_cut[fields[i]] = ret_data[fields[i]];
  
  //check types, explicitly checking price, this should be fixed and moved to ES part
  
  if (fields[i] == 'price')
  {
    ret_data_cut[fields[i]] = parseFloat(ret_data_cut[fields[i]]).toFixed(2);
  }
  
}

}



return ret_data_cut;
}
function parse_image(image_base64)
{
var response = {};
var matches = image_base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
response.type = matches[1];
response.data =  Buffer.from(matches[2], 'base64');
image_base64 = response.data


 const buffer = Buffer.from(image_base64, 'base64');
 const fileInfo =  fileType.fromBuffer(buffer);
 const detectedExt = fileInfo.ext;
 const detectedMime = fileInfo.mime;
// console.log(detectedExt) 

return {data:buffer , extension:detectedExt};
}
async function generate_unique_name(s3_bucket_name, s3_folder_name, ext)
{
var fname = uniqueFilename(s3_folder_name)+"."+ext;
for(var i = 0;i<100;i++)
{
try {
  await s3.headObject({Bucket:s3_bucket_name, Key:fname}).promise()
  console.log("File Found in S3");
  fname=0;
  continue
  } catch (err) {
 break;
}
}
return fname; 
}

module.exports.putStore = async function(event, context, callback) {

  let semevent = event;
  delete semevent.headers.Authorization;
  try{
    let dom = jwtdecode(event.headers.Authorization.replace("Bearer ", ""))
    console.log("UserInfo:",dom,"Event:",semevent,"Messege: put store");
  }
    catch{
      console.log("Event:",semevent,"Messege: del Categories");
    }
    
    // const jaiswal = resultoo.find(it => it.apikey == event.headers['x-api-key']);
    // if (JSON.stringify(jaiswal) == null ) 
    // {
    //   return callback(null, { statusCode: 401, body: 'apikey not found', headers: { 'Content-Type': 'text/plain' } });
    // }

    console.log(event)
    var doc = event.input_json;

    statusCode = 200;
    result = "success";
    result_len = 0;
   ret_data = {};
    if (event.hasOwnProperty('fields'))  
  {
  var fields = event.fields.split(",");
  if (fields.Length <= 0)
  {
   statusCode = 200;
   result = "success";
   result_len = 0;
  ret_data = {};
  }
  }
const URL = 'https://flexi-deal-pictures.s3-ap-southeast-2.amazonaws.com/';   

  var current_index = "store";
  var current_folder = "store_pictures_uat";
  try {

    var current_index ='store';
    var current_folder = 'store_pictures_uat';
    if (event.input_json.hasOwnProperty('featured'))
    {
      if (event.input_json.featured.hasOwnProperty('picture') )
      {                                                                                 
        
        let main_file_content = parse_image(event.input_json.featured.picture);
        let main_file_name = await generate_unique_name("flexi-deal-pictures",current_folder,'png');
        
        try {
  
          var s3_response = await s3.putObject({Bucket:"flexi-deal-pictures", Key:main_file_name, Body:main_file_content.data}).promise();
          console.log("deal_picture_featured",s3_response,main_file_name);
  
          // delete event.input_json.featured.picture_;
          
          event.input_json.featured.picture = URL + main_file_name;
          // console.log("URL_feautre_deal",doc.image_url);
        } catch(error_s3)
        {
          
        }
        }               
      }
      // BD2  --------------------------------END-----------------------------
  
    if (event.input_json.hasOwnProperty('image') && (event.input_json.image.hasOwnProperty('body')))
    {
    let main_file_content = parse_image(event.input_json.image.body);
    let main_file_name = await generate_unique_name("flexi-deal-pictures",current_folder,'png');
    
    try {
      var s3_response = await s3.putObject({Bucket:"flexi-deal-pictures", Key:main_file_name, Body:main_file_content.data}).promise();
      console.log("tmp0",s3_response,main_file_name);
    
      delete event.input_json.image;
      
      //check attempt to make update by name
      if (event.requesttype == "store" && event.input_json.hasOwnProperty('name') )
      {
        delete event.input_json.name;
      }
            //check end      

      if (event.requesttype == "store")
      {
      event.input_json.image_url = URL + main_file_name;
      } else
      {
        event.input_json.marketplace_image_url = URL + main_file_name;
      }
      console.log("URL",doc.image_url);
    } catch(error_s3)
    {
      
    }
    }
       //end if

       if (event.input_json.hasOwnProperty('end_time')) {
        event.input_json.end_time =   event.input_json.end_time + 24*3600-1;
        }

        if (event.input_json.hasOwnProperty('featured'))
        {
         if (event.input_json.featured.hasOwnProperty('featured_end_time'))
         {
          event.input_json.featured.featured_end_time += 24*3600-1;
        }
         }
       
       
      console.log("update",event.input_json); 
      var res = await client.update({index:current_index,body:{doc:event.input_json}, id:event.id});
      console.log("res",res);
      ret_data = {"id":res.body._id, "result":{"status":2,"status_text":"featured category is not enabled for this item"}};
  
      statusCode = 200;
      result = "success";
      result_len = 1;
    } catch (err) {
       console.log(err);
      statusCode = err.statusCode;
      result = "error";
      result_len = 0;
    }   
 
  
  const response = {
    statusCode: statusCode,
    status: result,
    result_length: result_len,
    body: ret_data

  }; 
 
return callback(null,response);

};

module.exports.postStore = async function(event, context, callback) {
  let semevent = event;
  delete semevent.headers.Authorization;
  try{
    let dom = jwtdecode(event.headers.Authorization.replace("Bearer ", ""))
    console.log("UserInfo:",dom,"Event:",semevent,"Messege: post store");
  }
    catch{
      console.log("Event:",semevent,"Messege: del Categories");
    }
console.log(event.input_json)

    statusCode = 200;
  result = "success";
  result_len = 0;
 ret_data = {};
  if (event.hasOwnProperty('fields'))  
{
var fields = event.fields.split(",");
if (fields.Length <= 0)
{
 statusCode = 200;
 result = "success";
 result_len = 0;
ret_data = {};
}
}
    const URL = 'https://flexi-deal-pictures.s3-ap-southeast-2.amazonaws.com/';   
    // image_url
    var current_index = "store"
    var current_folder = "store_pictures_uat"

    //   BD2 ------------- start---------------
    if (event.input_json.hasOwnProperty('featured'))
    {
      if (event.input_json.featured.hasOwnProperty('picture'))
      {                                                                               
          let main_file_content_feature = parse_image(event.input_json.featured.picture);
          // BD2
          let main_file_name_feature = await generate_unique_name("flexi-deal-pictures",current_folder,'png');
          var s3_response = await s3.putObject({ ContentType:'png',Bucket:"flexi-deal-pictures",Key:main_file_name_feature, Body:main_file_content_feature.data}).promise();

          event.input_json.featured.picture = URL + main_file_name_feature;     
         
        }                                           
      }

  //   BD2 ------------- end---------------

 
    try {

      var main_file_content = parse_image(event.input_json.image.body);
      var main_file_name = await generate_unique_name("flexi-deal-pictures",current_folder,main_file_content.extension);
      
      var s3_response = await s3.putObject({Bucket:"flexi-deal-pictures", Key:main_file_name, Body:main_file_content.data}).promise();
      console.log("tmp0",s3_response,main_file_name);
     
      var doc = event.input_json;
      delete doc.image;
      doc.image_url = URL + main_file_name;
      console.log("URL",doc.image_url);
      
      doc.name = doc.source_display_name.replace(/[^A-Za-z0-9]/g, '_');
      doc.name = doc.name.toLowerCase();
      
      doc.added = Date.now();
      doc["number_items"] = -1;

      doc["last_scraped"] = -1;
      
        if (!doc.hasOwnProperty('archived'))
        {
          doc["archived"] = 0;
        }
        
        if (!doc.hasOwnProperty('inactive'))
        {
          doc["inactive"] = 0;
        }                    
      
      doc.modified = Date.now();
      if (!doc.hasOwnProperty('tag'))
      {
        doc["tag"] = 1;
      }
      //doc['archived'] = 0;
      //doc['inactive'] = 0;
      //console.log("DOC",doc);
      let new_id = null;
      if (event.hasOwnProperty('id')  && event.id.length > 0)
      {
          new_id = event.id;
      }
      console.log(doc);
      var res = await client.index({index:current_index, body:doc, id:new_id});
      //console.log("res",res);
      ret_data = {"id":res.body._id, "result":{"status":2,"status_text":"featured category is not enabled for this item"}};

      statusCode = 200;
      result = "success";
      result_len = 1;
    } catch (err) {
      console.log("error",JSON.stringify(err));
      statusCode = err.statusCode;
      result = "error";
      result_len = 0;
    }         
 
 const response = {
  statusCode: statusCode,
  status: result,
  result_length: result_len,
  body: ret_data
}; 

return callback(null, response);

};

module.exports.delStore = async function(event, context, callback) {
  let semevent = event;
  delete semevent.headers.Authorization;
  try{
    let dom = jwtdecode(event.headers.Authorization.replace("Bearer ", ""))
    console.log("UserInfo:",dom,"Event:",semevent,"Messege: del store");
  }
    catch{
      console.log("Event:",semevent,"Messege: del Categories");
    }
    // const jaiswal = resultoo.find(it => it.apikey == event.headers['x-api-key']);
    // if (JSON.stringify(jaiswal) == null ) 
    // {
    //   return callback(null, { statusCode: 401, body: 'apikey not found', headers: { 'Content-Type': 'text/plain' } });
    // }

    
  console.log(event.input_json)
    statusCode = 200;
    result = "success";
    result_len = 0;
   ret_data = {};
    if (event.hasOwnProperty('fields'))  
  {
  var fields = event.fields.split(",");
  if (fields.Length <= 0)
  {
   statusCode = 200;
   result = "success";
   result_len = 0;
  ret_data = {};
  }
  }
//   return "app"

// var upload_index_search = {deal:"flexi_deal_uat", inspiration:"flexi_article"+stage, store:"flexi_store"+stage,product:"flexi_product_v4"+stage};

try {
    var current_index = "store"
    
      var res = await client.delete({index:current_index, id:event.id});
      //console.log("res",res);
      ret_data = {"id":res.body._id};

      statusCode = 200;
      result = "success";
      result_len = 1;
    } catch (err) {

      console.error(err)
      statusCode = err.statusCode;
      result = "error";
      result_len = 0;
    }                
 
    const response = {
      statusCode: statusCode,
      status: result,
      result_length: result_len,
      body: ret_data
    }; 

    return callback(null,response);
};

module.exports.countStore = async function(event, context, callback) {
  let semevent = event;
  delete semevent.headers.Authorization;
  try{
    let dom = jwtdecode(event.headers.Authorization.replace("Bearer ", ""))
    console.log("UserInfo:",dom,"Event:",semevent,"Messege: count store");
  }
    catch{
      console.log("Event:",semevent,"Messege: del Categories");
    }
  // const jaiswal = resultoo.find(it => it.apikey == event.headers['x-api-key']);
  // if (JSON.stringify(jaiswal) == null ) 
  // {
  //   return callback(null, { statusCode: 401, body: 'apikey not found', headers: { 'Content-Type': 'text/plain' } });
  // }

  var time_key = 'added';
  
  var current_index = "store";



  statusCode = 200;
  result = "success";
  result_len = 0;
 ret_data = {};
  if (event.hasOwnProperty('fields'))  
{
var fields = event.fields.split(",");
if (fields.Length <= 0)
{
 statusCode = 200;
 result = "success";
 result_len = 0;
ret_data = {};
}
}
  try {
    // console.log(upload_index_search[event.requesttype]);
    let time_query = {};
    time_query[time_key] = {gte:parseInt(event.time)*1000};
    
    // let current_index = upload_index_search[event.requesttype];
    let ret_result =  await client.search({index:current_index,body:{query:{range:time_query }},  size: 0, track_total_hits:true});
    
    console.log(ret_result);
    ret_data = {'count':ret_result.body.hits.total.value};
    result_len = 1;
  } catch(err)
  {

    console.log(err)
     statusCode = 500;
     result = "error " + err.statusCode;
  }



  const response = {
    statusCode: statusCode,
    status: result,
    result_length: result_len,
    body: ret_data

  };
  return callback(null,response);
};

module.exports.countStores = async function(event, context, callback) {
  let semevent = event;
  delete semevent.headers.Authorization;
  try{
    let dom = jwtdecode(event.headers.Authorization.replace("Bearer ", ""))
    console.log("UserInfo:",dom,"Event:",semevent,"Messege: count store api");
  }
    catch{
      console.log("Event:",semevent,"Messege: del Categories");
    }
  const jaiswal = resultoo.find(it => it.apikey == event.headers['x-api-key']);
  if (JSON.stringify(jaiswal) == null ) 
  {
    return callback(null, { statusCode: 401, body: 'apikey not found', headers: { 'Content-Type': 'text/plain' } });
  }

  var time_key = 'added';
  
  var current_index = "store";
  var statusCode = 200;
  var result = "success";
  var result_len = 0;
  var ret_data = {};


  if (event.hasOwnProperty('fields'))  
{
var fields = event.fields.split(",");
if (fields.Length <= 0)
{
 statusCode = 200;
 result = "success";
 result_len = 0;
ret_data = {};
}
}
  try {
    // console.log(upload_index_search[event.requesttype]);
    let time_query = {};
    time_query[time_key] = {gte:parseInt(event.time)*1000};
    
    // let current_index = upload_index_search[event.requesttype];
    let ret_result =  await client.search({index:current_index,body:{query:{range:time_query }},  size: 0, track_total_hits:true});
    
    console.log(ret_result);
    ret_data = {'count':ret_result.body.hits.total.value};
    result_len = 1;
  } catch(err)
  {

    console.log(err)
     statusCode = 500;
     result = "error " + err.statusCode;
  }



  const response = {
    statusCode: statusCode,
    status: result,
    result_length: result_len,
    body: ret_data

  };
  return callback(null,response);
};


module.exports.getbyIdStore = async function (event, context, callback) {
  let semevent = event;
  delete semevent.headers.Authorization;
  try{
    let dom = jwtdecode(event.headers.Authorization.replace("Bearer ", ""))
    console.log("UserInfo:",dom,"Event:",semevent,"Messege: get single store");
  }
    catch{
      console.log("Event:",semevent,"Messege: del Categories");
    }
  // const jaiswal = resultoo.find(it => it.apikey == event.headers['x-api-key']);
  // if (JSON.stringify(jaiswal) == null ) 
  // {
  //   return callback(null, { statusCode: 401, body: 'apikey not found', headers: { 'Content-Type': 'text/plain' } });
  // }
  // return "app"



  statusCode = 200;
  result = "success";
  result_len = 0;
 ret_data = {};
  if (event.hasOwnProperty('fields'))  
{
var fields = event.fields.split(",");
if (fields.Length <= 0)
{
 statusCode = 200;
 result = "success";
 result_len = 0;
ret_data = {};
}
}
  var ret_data={}
  var index_name = "store";
  // var request_type = popularity_search[event.request];
  let item_error = 0;
  let store_dname = "";

  try {
    let app_id = '';
    if (event.hasOwnProperty('app') && ['a:humm', 'a:bundll', 'a:humm90', 'a:hummpro'].includes(event.app)) {
      app_id = event.app;
    }

    await client.index({ index: "stats_popularity", body: { user: event.userid, item_type: "store_uat", item_id: event.id, added: Date.now(), app: app_id } });

  }
  catch (err) {
console.log(err)
  }

  try {
    let ret_result = await client.get({ index: index_name, id: event.id });
    console.log(ret_result);
    //check validity. todo: edit field names and types inside the API (make "getbyid" and "requesttype")
    if (event.request == "getbyid") {
      try {

        let current_store = ret_result.body._source.source;
        console.log(current_store);
        let store_res = await client.search({ index: "store", _source_includes: ["inactive", "archived", "source_display_name"], body: { query: { match: { "name.keyword": current_store } } } });
        // console.log(store_res.body.hits.hits,"dddddddddddddddddddddddd");
        console.log(store_res)
        if (store_res.body.hits.hits.length == 0) {
          item_error = 1;
        }
        else {

          store_dname = store_res.body.hits.hits[0]._source.source_display_name;
          ret_result.body._source.source_display_name = store_dname;
          if (store_res.body.hits.hits[0]._source.archived != 0 || store_res.body.hits.hits[0]._source.inactive == 1) {
            item_error = 2;
          }
        }
      }
      catch (err) {
        console.error(err)

        item_error = 3;
      }
    }


    if (item_error == 0) {
      ret_data = ret_result.body._source;
      ret_data.id = ret_result.body._id;
      result_len = 1;

      //cut fields
      var ret_data_cut = {};
      ret_data_cut = cut_fields(fields, ret_data);
      ret_data_cut['id'] = ret_data['id'];

      ret_data = [ret_data_cut];
    } else {
      statusCode = 404;
      result = "error, the item does not exist (inactive/archived/expired)";
      result_len = 0;
    }
    ////
  }
  catch (err) {
    console.error(err)
    statusCode = err.statusCode;
    result = "error";
    result_len = 0;
  }


  const response = {
    statusCode: statusCode,
    status: result,
    result_length: result_len,
    body: ret_data

  };
  return callback(null,response);

}; 

module.exports.getbyIdStores = async function (event, context, callback) {
  let semevent = event;
  delete semevent.headers.Authorization;
  try{
    let dom = jwtdecode(event.headers.Authorization.replace("Bearer ", ""))
    console.log("UserInfo:",dom,"Event:",semevent,"Messege: get by id store");
  }
    catch{
      console.log("Event:",semevent,"Messege: del Categories");
    }
  statusCode = 200;
  result = "success";
  result_len = 0;
 ret_data = {};
  if (event.hasOwnProperty('fields'))  
{
var fields = event.fields.split(",");
if (fields.Length <= 0)
{
 statusCode = 200;
 result = "success";
 result_len = 0;
ret_data = {};
}
}
  const jaiswal = resultoo.find(it => it.apikey == event.headers['x-api-key']);
  if (JSON.stringify(jaiswal) == null ) 
  {
    return callback(null, { statusCode: 401, body: 'apikey not found', headers: { 'Content-Type': 'text/plain' } });
  }
  // return "app"

  console.log(event)
  var ret_data={}
  var index_name = "store";
  // var request_type = popularity_search[event.request];
  let item_error = 0;
  let store_dname = "";

  try {
    let app_id = '';
    if (event.hasOwnProperty('app') && ['a:humm', 'a:bundll', 'a:humm90', 'a:hummpro'].includes(event.app)) {
      app_id = event.app;
    }

    await client.index({ index: "stats_popularity", body: { user: event.userid, item_type: "store_uat", item_id: event.id, added: Date.now(), app: app_id } });

  }
  catch (err) {
    console.error(err)
  }

  try {
    let ret_result = await client.get({ index: index_name, id: event.id });

    console.log(ret_result);
    //check validity. todo: edit field names and types inside the API (make "getbyid" and "requesttype")
    if (event.request == "getbyid") {
      try {

        let current_store = ret_result.body._source.source;
        console.log(current_store);
        let store_res = await client.search({ index: "store", _source_includes: ["inactive", "archived", "source_display_name"], body: { query: { match: { "name.keyword": current_store } } } });
        console.log(store_res.body.hits.hits);
        if (store_res.body.hits.hits.length == 0) {
          item_error = 1;
        }
        else {
          store_dname = store_res.body.hits.hits[0]._source.source_display_name;
          ret_result.body._source.source_display_name = store_dname;
          if (store_res.body.hits.hits[0]._source.archived != 0 || store_res.body.hits.hits[0]._source.inactive == 1) {
            item_error = 2;
          }
        }
      }
      catch (err) {
        console.error(err)

        item_error = 3;
      }
    }


    if (item_error == 0) {
      ret_data = ret_result.body._source;
      ret_data.id = ret_result.body._id;
      result_len = 1;

      //cut fields
      var ret_data_cut = {};
      ret_data_cut = cut_fields(fields, ret_data);
      ret_data_cut['id'] = ret_data['id'];

      ret_data = [ret_data_cut];
    } else {
      statusCode = 404;
      result = "error, the item does not exist (inactive/archived/expired)";
      result_len = 0;
    }
    ////
  }
  catch (err) {
    console.error(err)
    statusCode = err.statusCode;
    result = "error";
    result_len = 0;
  }


  const response = {
    statusCode: statusCode,
    status: result,
    result_length: result_len,
    body: ret_data

  };
  return callback(null,response);

}; 
module.exports.searchStore = async function (event, context, callback) {
  let semevent = event;
  delete semevent.headers.Authorization;
  try{
    let dom = jwtdecode(event.headers.Authorization.replace("Bearer ", ""))
    console.log("UserInfo:",dom,"Event:",semevent,"Messege: search store");
  }
    catch{
      console.log("Event:",semevent,"Messege: del Categories");
    }
  // const jaiswal = resultoo.find(it => it.apikey == event.headers['x-api-key']);
  // if (JSON.stringify(jaiswal) == null ) 
  // {
  //   return callback(null, { statusCode: 401, body: 'apikey not found', headers: { 'Content-Type': 'text/plain' } });
  // }
 
var statusCode = 200;
var result = "success";
var result_len = 0;
var ret_data = {};

  ret_data = {};
  var bool_query = [];
  var min_score = 0;
  var ids_dict = {};
  var search_index_name = "";

  upload_index_search="store"
  if (event.hasOwnProperty('fields'))  
{
var fields = event.fields.split(",");
if (fields.Length <= 0)
{
 statusCode = 200;
 result = "success";
 result_len = 0;
ret_data = {};
}
}

  
  if (event.hasOwnProperty('query')  && event.query.length > 0)
  {
    try
    {
    let recent_searches_query_body = {user:event.userid,query:event.query,added:Date.now()};  
    console.log(recent_searches_query_body)
      
    if (event.app != 'all')
    {
     var apps = event.app.split(",");
     let filtertest = apps.filter(value => ['a:humm', 'a:bundll', 'a:humm90', 'a:hummpro'].includes(value));
     if (filtertest.length == 0)
     {
       return callback("error:wrong app id");
     }
     console.log("apps", apps);
     if (apps.length == 1)
     {
       recent_searches_query_body['app'] = apps[0];
     }
    }
      
    await client.index({index:"recent_searches", body:recent_searches_query_body});
    }
      catch (err)
  {
    console.error(err)
  statusCode = err.statusCode;
  result = "error2";
  result_len = 0;
  return;
  }
  }

    //add app checking

    if (event.app != 'all')
    {
     var apps = event.app.split(",");
     let filtertest = apps.filter(value => ['a:humm', 'a:bundll', 'a:humm90', 'a:hummpro'].includes(value));
     if (filtertest.length == 0)
     {
       return callback("error:wrong app id");
     }
     
             bool_query.push({
              bool: {
          must: [{"terms_set": {
    visible_on_platforms: {
      terms: apps,
      minimum_should_match_script: {
        source: "1"
      },
    }
  }
            
            }]
      }
          });
          
        if(event.hasOwnProperty('filter') && event.filter.includes('featured')) 
        {
          
                        bool_query.push({
              bool: {
          must: [{"terms_set": {
    featured_on_platforms: {
      terms: apps,
      minimum_should_match_script: {
        source: "1"
      },
    }
  }
            
            }]
      }
          });
          
        }
          
    }
    
    search_index_name = 'store';
   console.log(search_index_name);
  //todo: remove for store
  //todo: add validation, as above
  
      if (event.feed == '1')
    {
             bool_query.push({
              bool: {
          must: [{term: {feed: true}}]
      }
          });
    }
  
  if (event.hasOwnProperty('query')  && event.query.length > 0 && ! (event.hasOwnProperty('search_type') && event.search_type == "products_sold_by") )
  {
    //todo: fix this construction to proper switch.
    if (event.requesttype == "store"){
      let bq = {"bool": {
    "should": [
         {
 
 "match": {
    "source_display_name": event.query
  }
  
}, 
      { "prefix": { "source_display_name": event.query } },
      { "fuzzy": { "source_display_name": { "value": event.query, "fuzziness": 2, "prefix_length": 0 } } }
    ]
  }}
      bool_query.push(bq);
      //bool_query.push({"fuzzy":{"name":{"value":event.query}}});
    }
    
    else {
      
              let bq = {"bool": {
    "should": [
      { "prefix": { "title.keyword": event.query } },
      { "fuzzy": { "title.keyword": { "value": event.query, "fuzziness": 2, "prefix_length": 0 } } }
    ]
  }}
      bool_query.push(bq);
      /*
    bool_query.push({
                  multi_match: {query:event.query, fields: ["title.ngram"] }
                    });
                    */
                    
    }
                    
  } else if (event.hasOwnProperty('query')  && event.query.length > 0 &&  event.hasOwnProperty('search_type') && event.search_type == "products_sold_by" )
  {
    let agg_q = {
     query: 
       {
         multi_match: {query:event.query, fields: ["title^4","description^2"] }
      },
        aggs: {
           all_indexes: {
              terms: {
                 field: "source.keyword",
                 size: 10000
              }
           }
        }
    }
    console.log("agg",agg_q )
    let agg_result =  await client.search({index:'product', body:agg_q, size:0});
    
    let array_stores = [];
    
    let ret_data_tmp = agg_result.body.aggregations.all_indexes.buckets;

    for (let i = 0; i < ret_data_tmp.length; i++) 
    {
      array_stores.push(ret_data_tmp[i].key);
    }
    
    
let q_agg =    {bool:{should:[
      {
 
 "match": {
    "source_display_name": event.query
  }
  
}, 
  
  {
 
      wildcard: {
          "source_display_name": {
              "value": "*"+event.query+"*",
              "boost": 5.0,
              "rewrite": "constant_score"
          }
      }
  
} ,{ "fuzzy": { "source_display_name": { "boost":10,"value": event.query, "fuzziness": 2, "prefix_length": 0 } } }, {
  terms: {
    name: array_stores
  }
}]}};
    
    /*
          let q_agg = {
          bool: {
              must: [{
  terms: {
    name: array_stores
  }
}]
          }
      };
      */
     bool_query.push(q_agg);

    
  }
  
   if (event.hasOwnProperty('categories')  && event.categories.length > 0)
   {
     let categories = event.categories.split(",");
     let internal_cat = [];
     for (var i = 0; i < categories.length; i++)
     {
       internal_cat.push({term: {category: categories[i]}});
     }
            let q = {
                  bool: {
                      should: internal_cat
                  }
              };
     bool_query.push(q);
   }
    
    /*
    bool_query.push({
          bool: {
              must: [{term: {inactive: 0}}]
          }
      });
     */
     bool_query.push({
          bool: {
              must: [{term: {archived: 0}}]
          }
      });

      if (event.hasOwnProperty("scrape") &&  event.scrape==1){
        bool_query.push({
          bool: {
              must: [{term: {type: 1}}]
          }
      });
    }
      //filter tags
  //console.log("filter",event.hasOwnProperty('filter'));
  //todo: merge all filter queries into one, remove copy-paste
      if (event.hasOwnProperty('filter')  && event.filter.length > 0)
   {
     console.log('filter',event.filter);
        if (event.filter == 'featured'){
    let q = {
          bool: {
              must: [{term: {tag: 2}}]
          }
      };
     bool_query.push(q);
     
                  bool_query.push({
          bool: {
              must: [{term: {inactive: 0}}]
          }
      });
     
     let t_now = Math.round(Date.now()/1000);

     let featured_active_bool =  {
      bool: {
        filter: [
          {
            range: {
              "featured.featured_start_time":{
                lte:t_now
              }
            }
          },
          {
            range: {
              "featured.featured_end_time":{
                gte:t_now
              }
            }
          }
        ]
      }
    
    };
    bool_query.push(featured_active_bool);

   } 
   else if (event.filter == 'featured_all'){
    let q = {
          bool: {
              must: [{term: {tag: 2}}]
          }
      };
     bool_query.push(q);
   } 
       else if (event.filter == 'featured_active'){
    let q = {
          bool: {
              must: [{term: {tag: 2}}]
          }
      };
     bool_query.push(q);
           bool_query.push({
          bool: {
              must: [{term: {inactive: 0}}]
          }
      });
     
   }  
   
            else if (event.filter == 'featured_inactive'){
    let q = {
          bool: {
              must: [{term: {tag: 2}}]
          }
      };
     bool_query.push(q);
     bool_query.push({
          bool: {
              must: [{term: {inactive: 1}}]
          }
      });
   }  
   
   else if(event.filter == 'enabled')
   {
           let q = {
          bool: {
              must: [{term: {inactive: 0}}]
          }
      };
     bool_query.push(q);
   }
   else if(event.filter == 'disabled')
   {
      let q = {
          bool: {
              must: [{term: {inactive: 1}}]
          }
      };
     bool_query.push(q);
     
   }
   else if (event.filter == 'popular' || event.filter == 'trending')
   {
     console.log("POPULAR")
     let body_q1 = {}
     if (event.filter == 'popular')
     {
      body_q1 = {
  query:{terms:{
    item_type: [ event.requesttype] }
  },
  size: 0,aggs : {
      popular_queries : {
          terms : { field : "item_id.keyword",size: 100 } 
      }
  }};
     }
     else
     {
     body_q1 = {
  query:{bool:{must: [{terms:{
    item_type: [ event.requesttype] }}, {   range: {
    added: {
      gte: Date.now()-604800000
    }
  }}]
    
  }},
  size: 0,aggs : {
      popular_queries : {
          terms : { field : "item_id.keyword",size: 20 } 
      }
  }};
     }
  
    console.log("Q",JSON.stringify(body_q1));
    let ret_result =  await client.search({index:'stats_popularity', body:body_q1, size:25});
    let ret_data_tmp = ret_result.body.aggregations.popular_queries.buckets;
    let ids_req = [];
   
    for (let i = 0; i < ret_data_tmp.length; i++) 
    {
      ids_req.push(ret_data_tmp[i].key);
      ids_dict[ret_data_tmp[i].key] = ret_data_tmp[i].doc_count;
    }
     
    let q = {
          bool: {
              must: [{
  terms: {
    _id: ids_req
  }
}]
          }
      };
     bool_query.push(q);
     
   }
   } else
   {
           bool_query.push({
          bool: {
              must: [{term: {inactive: 0}}]
          }
      });
   }
   
  
  
  //filter tags end
  
  // _+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


  let body_q = {query: {bool: {must:bool_query}}};
if(min_score != 0)
{
body_q.min_score = min_score;
}
if (event.hasOwnProperty('sort')  &&event.sort.length > 0)
{
  if (event.sort == 'price_asc')
  {
    body_q['sort'] = {price:{order:'asc'}};
  } else if (event.sort == 'price_desc')
  {
    body_q['sort'] = {price:{order:'desc'}};
  }
}

console.log("executing",JSON.stringify(body_q));
try {
var from = 0;
var size = 20;
if (event.hasOwnProperty('from') && event.from.length > 0 && !isNaN(event.from))
{
  from = event.from;
}

 if (event.hasOwnProperty('size') && event.size.length > 0 && !isNaN(event.size))
{
  size = event.size;
}
 
console.log("fields",fields );

//randomization
if(event.hasOwnProperty('feed') && event.feed == '1')
{
   let tmp_q ={ "query": {
  "function_score": {"query":body_q.query,

      "random_score": {}
  }
}
};
  body_q = tmp_q;
  
}

//randomization end
if (event.requesttype=="deal")
{
  console.log("executing body query",JSON.stringify(body_q))
}



if (event.requesttype=='store')
{  
  body_q['sort'] = {added:{order:'asc'}}
}

// body_q['sort'] = {added:{order:'asc'}}
console.log("executing ",JSON.stringify(body_q));
let ret_result =  await client.search({index:search_index_name, body:body_q, from : from, size:size, _source:fields});
// console.log("result",ret_result );
ret_data = ret_result.body.hits.hits;
result_len = ret_result.body.hits.total.value;
var ret_data_cut = [];

//console.log("length",ret_data.length );

for (var j = 0; j < ret_data.length; j++)
{
var ret_data_entity = {};
ret_data_entity = cut_fields(fields,ret_data[j]._source);
ret_data_entity['id'] = ret_data[j]['_id'];
ret_data_cut.push(ret_data_entity);
     
}
ret_data = ret_data_cut;
result = "success";

} 
catch(err)
{

  console.log(err)
statusCode = err.statusCode;
result = "error 222";
result_len = 0;
}

  const response = {
    statusCode: statusCode,
    status: result,
    result_length: result_len,
    body: ret_data

  };
  return callback(null,response);

}; 
module.exports.searchStores = async function (event, context, callback) {
  let semevent = event;
  delete semevent.headers.Authorization;
  try{
    let dom = jwtdecode(event.headers.Authorization.replace("Bearer ", ""))
    console.log("UserInfo:",dom,"Event:",semevent,"Messege: search store api");
  }
    catch{
      console.log("Event:",semevent,"Messege: del Categories");
    }

  const jaiswal = resultoo.find(it => it.apikey == event.headers['x-api-key']);
  if (JSON.stringify(jaiswal) == null ) 
  {
    return callback(null, { statusCode: 401, body: 'apikey not found', headers: { 'Content-Type': 'text/plain' } });
  }
  
var statusCode = 200;
var result = "success";
var result_len = 0;
var ret_data = {};

statusCode = 200;
  result = "success";
  result_len = 0;
 ret_data = {};
  if (event.hasOwnProperty('fields'))  
{
var fields = event.fields.split(",");
if (fields.Length <= 0)
{
 statusCode = 200;
 result = "success";
 result_len = 0;
ret_data = {};
}
}
  ret_data = {};
  var bool_query = [];
  var min_score = 0;
  var ids_dict = {};
  var search_index_name = "";

  upload_index_search="store"
  if (event.hasOwnProperty('fields'))  
{
var fields = event.fields.split(",");
if (fields.Length <= 0)
{
 statusCode = 200;
 result = "success";
 result_len = 0;
ret_data = {};
}
}

  if (event.hasOwnProperty('query')  && event.query.length > 0)
  {
    try
    {
    let recent_searches_query_body = {user:event.userid,query:event.query,added:Date.now()};  
      
    if (event.app != 'all')
    {
     var apps = event.app.split(",");
     let filtertest = apps.filter(value => ['a:humm', 'a:bundll', 'a:humm90', 'a:hummpro'].includes(value));
     if (filtertest.length == 0)
     {
       return callback("error:wrong app id");
     }
     console.log("apps", apps);
     if (apps.length == 1)
     {
       recent_searches_query_body['app'] = apps[0];
     }
    }
      
    await client.index({index:"recent_searches", body:recent_searches_query_body});
    }
      catch (err)
  {
    console.error(err)
  statusCode = err.statusCode;
  result = "error2";
  result_len = 0;
  return;
  }
  }



    //add app checking
      
    if (event.app != 'all')
    {
     var apps = event.app.split(",");
     let filtertest = apps.filter(value => ['a:humm', 'a:bundll', 'a:humm90', 'a:hummpro'].includes(value));
     if (filtertest.length == 0)
     {
       return callback("error:wrong app id");
     }
     
             bool_query.push({
              bool: {
          must: [{"terms_set": {
    visible_on_platforms: {
      terms: apps,
      minimum_should_match_script: {
        source: "1"
      },
    }
  }
            
            }]
      }
          });
          
        if(event.hasOwnProperty('filter') && event.filter.includes('featured')) 
        {
          
                        bool_query.push({
              bool: {
          must: [{"terms_set": {
    featured_on_platforms: {
      terms: apps,
      minimum_should_match_script: {
        source: "1"
      },
    }
  }
            
            }]
      }
          });
          
        }
          
    }
    
    
    //end app checking
    
    search_index_name = "store";
   console.log(search_index_name);
  //todo: remove for store
  //todo: add validation, as above
  
      if (event.feed == '1')
    {
             bool_query.push({
              bool: {
          must: [{term: {feed: true}}]
      }
          });
    }
  
  if (event.hasOwnProperty('query')  && event.query.length > 0 && ! (event.hasOwnProperty('search_type') && event.search_type == "products_sold_by") )
  {
    //todo: fix this construction to proper switch.
    if (event.requesttype == "store"){
      let bq = {"bool": {
    "should": [
         {
 
 "match": {
    "source_display_name": event.query
  }
  
}, 
      { "prefix": { "source_display_name": event.query } },
      { "fuzzy": { "source_display_name": { "value": event.query, "fuzziness": 2, "prefix_length": 0 } } }
    ]
  }}
      bool_query.push(bq);
      //bool_query.push({"fuzzy":{"name":{"value":event.query}}});
    }
    
    else {
      
              let bq = {"bool": {
    "should": [
      { "prefix": { "title.keyword": event.query } },
      { "fuzzy": { "title.keyword": { "value": event.query, "fuzziness": 2, "prefix_length": 0 } } }
    ]
  }}
      bool_query.push(bq);
      /*
    bool_query.push({
                  multi_match: {query:event.query, fields: ["title.ngram"] }
                    });
                    */
                    
    }
                    
  } else if (event.hasOwnProperty('query')  && event.query.length > 0 &&  event.hasOwnProperty('search_type') && event.search_type == "products_sold_by" )
  {
    let agg_q = {
     query: 
       {
         multi_match: {query:event.query, fields: ["title^4","description^2"] }
      },
        aggs: {
           all_indexes: {
              terms: {
                 field: "source.keyword",
                 size: 10000
              }
           }
        }
    }
    console.log("agg",agg_q )
    let agg_result =  await client.search({index:'product', body:agg_q, size:0});
    
    let array_stores = [];
    
    let ret_data_tmp = agg_result.body.aggregations.all_indexes.buckets;

    for (let i = 0; i < ret_data_tmp.length; i++) 
    {
      array_stores.push(ret_data_tmp[i].key);
    }
    
    
let q_agg =    {bool:{should:[
      {
 
 "match": {
    "source_display_name": event.query
  }
  
}, 
  
  {
 
      wildcard: {
          "source_display_name": {
              "value": "*"+event.query+"*",
              "boost": 5.0,
              "rewrite": "constant_score"
          }
      }
  
} ,{ "fuzzy": { "source_display_name": { "boost":10,"value": event.query, "fuzziness": 2, "prefix_length": 0 } } }, {
  terms: {
    name: array_stores
  }
}]}};
    
    /*
          let q_agg = {
          bool: {
              must: [{
  terms: {
    name: array_stores
  }
}]
          }
      };
      */
     bool_query.push(q_agg);

    
  }
  
   if (event.hasOwnProperty('categories')  && event.categories.length > 0)
   {
     let categories = event.categories.split(",");
     let internal_cat = [];
     for (var i = 0; i < categories.length; i++)
     {
       internal_cat.push({term: {category: categories[i]}});
     }
            let q = {
                  bool: {
                      should: internal_cat
                  }
              };
     bool_query.push(q);
   }
    
    /*
    bool_query.push({
          bool: {
              must: [{term: {inactive: 0}}]
          }
      });
     */
     bool_query.push({
          bool: {
              must: [{term: {archived: 0}}]
          }
      });
  
      //filter tags
  //console.log("filter",event.hasOwnProperty('filter'));
  //todo: merge all filter queries into one, remove copy-paste
      if (event.hasOwnProperty('filter')  && event.filter.length > 0)
   {
     console.log('filter',event.filter);
        if (event.filter == 'featured'){
    let q = {
          bool: {
              must: [{term: {tag: 2}}]
          }
      };
     bool_query.push(q);
     
                  bool_query.push({
          bool: {
              must: [{term: {inactive: 0}}]
          }
      });
     
     let t_now = Math.round(Date.now()/1000);

     let featured_active_bool =  {
      bool: {
        filter: [
          {
            range: {
              "featured.featured_start_time":{
                lte:t_now
              }
            }
          },
          {
            range: {
              "featured.featured_end_time":{
                gte:t_now
              }
            }
          }
        ]
      }
    
    };
    bool_query.push(featured_active_bool);

   } 
   else if (event.filter == 'featured_all'){
    let q = {
          bool: {
              must: [{term: {tag: 2}}]
          }
      };
     bool_query.push(q);
   } 
       else if (event.filter == 'featured_active'){
    let q = {
          bool: {
              must: [{term: {tag: 2}}]
          }
      };
     bool_query.push(q);
           bool_query.push({
          bool: {
              must: [{term: {inactive: 0}}]
          }
      });
     
   }  
   
            else if (event.filter == 'featured_inactive'){
    let q = {
          bool: {
              must: [{term: {tag: 2}}]
          }
      };
     bool_query.push(q);
     bool_query.push({
          bool: {
              must: [{term: {inactive: 1}}]
          }
      });
   }  
   
   else if(event.filter == 'enabled')
   {
           let q = {
          bool: {
              must: [{term: {inactive: 0}}]
          }
      };
     bool_query.push(q);
   }
   else if(event.filter == 'disabled')
   {
      let q = {
          bool: {
              must: [{term: {inactive: 1}}]
          }
      };
     bool_query.push(q);
     
   }
   else if (event.filter == 'popular' || event.filter == 'trending')
   {
     console.log("POPULAR")
     let body_q1 = {}
     if (event.filter == 'popular')
     {
      body_q1 = {
  query:{terms:{
    item_type: [ event.requesttype] }
  },
  size: 0,aggs : {
      popular_queries : {
          terms : { field : "item_id.keyword",size: 100 } 
      }
  }};
     }
     else
     {
     body_q1 = {
  query:{bool:{must: [{terms:{
    item_type: [ event.requesttype] }}, {   range: {
    added: {
      gte: Date.now()-604800000
    }
  }}]
    
  }},
  size: 0,aggs : {
      popular_queries : {
          terms : { field : "item_id.keyword",size: 20 } 
      }
  }};
     }
  
    console.log("Q",JSON.stringify(body_q1));
    let ret_result =  await client.search({index:'stats_popularity', body:body_q1, size:25});
    let ret_data_tmp = ret_result.body.aggregations.popular_queries.buckets;
    let ids_req = [];
   
    for (let i = 0; i < ret_data_tmp.length; i++) 
    {
      ids_req.push(ret_data_tmp[i].key);
      ids_dict[ret_data_tmp[i].key] = ret_data_tmp[i].doc_count;
    }
     
    let q = {
          bool: {
              must: [{
  terms: {
    _id: ids_req
  }
}]
          }
      };
     bool_query.push(q);
     
   }
   } else
   {
           bool_query.push({
          bool: {
              must: [{term: {inactive: 0}}]
          }
      });
   }
   
  
  
  //filter tags end
  
  // _+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


  let body_q = {query: {bool: {must:bool_query}}};
if(min_score != 0)
{
body_q.min_score = min_score;
}
if (event.hasOwnProperty('sort')  &&event.sort.length > 0)
{
  if (event.sort == 'price_asc')
  {
    body_q['sort'] = {price:{order:'asc'}};
  } else if (event.sort == 'price_desc')
  {
    body_q['sort'] = {price:{order:'desc'}};
  }
}

console.log("executing",JSON.stringify(body_q));
try {
var from = 0;
var size = 20;
if (event.hasOwnProperty('from') && event.from.length > 0 && !isNaN(event.from))
{
  from = event.from;
}

 if (event.hasOwnProperty('size') && event.size.length > 0 && !isNaN(event.size))
{
  size = event.size;
}
 
console.log("fields",fields );

//randomization
if(event.hasOwnProperty('feed') && event.feed == '1')
{
   let tmp_q ={ "query": {
  "function_score": {"query":body_q.query,

      "random_score": {}
  }
}
};
  body_q = tmp_q;
  
}

//randomization end
if (event.requesttype=="deal")
{
  console.log("executing111 ",JSON.stringify(body_q))
}



if (event.requesttype=='store')
{  
  body_q['sort'] = {added:{order:'asc'}}
}

// body_q['sort'] = {added:{order:'asc'}}
console.log("executing ",JSON.stringify(body_q));
let ret_result =  await client.search({index:search_index_name, body:body_q, from : from, size:size, _source:fields});
// console.log("result",ret_result );
ret_data = ret_result.body.hits.hits;
result_len = ret_result.body.hits.total.value;
var ret_data_cut = [];

//console.log("length",ret_data.length );

for (var j = 0; j < ret_data.length; j++)
{
var ret_data_entity = {};
ret_data_entity = cut_fields(fields,ret_data[j]._source);
ret_data_entity['id'] = ret_data[j]['_id'];
ret_data_cut.push(ret_data_entity);
     
}
ret_data = ret_data_cut;
result = "success";

} 
catch(err)
{

  console.log(err)
statusCode = err.statusCode;
result = "error 222";
result_len = 0;
}

  const response = {
    statusCode: statusCode,
    status: result,
    result_length: result_len,
    body: ret_data

  };
  return callback(null,response);

}; 
