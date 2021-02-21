const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const { Client } = require('@elastic/elasticsearch');
const fileType = require('file-type');
var uniqueFilename = require('unique-filename')
const jwtdecode = require("jwt-decode");
// const client = new Client({ node: 'https://search-productdata-gewson6zruy7khdgnogwvy5jha.ap-southeast-2.es.amazonaws.com' });
const client = new Client({ node: 'https://vpc-uat-mp-db-idsrwibpn43v2yjzmote3nhcte.ap-southeast-2.es.amazonaws.com' });
'use strict';
var statusCode = 200;
var result = "success";
var result_len = 0;
var ret_data = {};
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
ret_data = "executing search";
var bool_query = [];
var min_score = 0;
var ids_dict = {};
var search_index_name = "";
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
module.exports.putDeals = async function(event, context, callback) {
  let semevent = event;
  delete semevent.headers.Authorization;
  try{
    let dom = jwtdecode(event.headers.Authorization.replace("Bearer ", ""))
    console.log("UserInfo:",dom,"Event:",semevent,"Messege: Edit Deals");
    }
    catch{
      console.log("Event:",semevent,"Messege: Add Deals");
    }

  // console.log(event.input_json)
    // const jaiswal = resultoo.find(it => it.apikey == event.headers['x-api-key']);
    // if (JSON.stringify(jaiswal) == null ) 
    // {
    //   return callback(null, { statusCode: 401, body: 'apikey not found', headers: { 'Content-Type': 'text/plain' } });
    // }
  

  // return "put deals"

// start requirement codes


// var upload_index_search = {deal:"flexi_deal"+stage, inspiration:"flexi_article"+stage, store:"flexi_store"+stage,product:"flexi_product_v4"+stage};
// var upload_folders = {deal:"pictures"+stage, inspiration:"article_pictures"+stage,store:"store_pictures"+stage};
// const URL = 'https://flexi-deal-pictures.s3-website-ap-southeast-2.amazonaws.com/';   

URL = 'https://flexi-deal-pictures.s3-ap-southeast-2.amazonaws.com/'; 
// end req codes

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
  
 statusCode = 200;
 result = "success";
 result_len = 0;
 ret_data = {};
 
  try {
    // console.log(upload_index_search[event.requesttype]);
  var current_index = 'deal';
    //  console.log(upload_index_search[event.requesttype]);
     ///if it has image
   var current_folder = 'pictures_uat';
   // BD2 -------------------------------start------------------------------
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
      {console.error(err)
        
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
     
     //end if 
    console.log("update",event.input_json); 
    var res = await client.update({index:current_index,body:{doc:event.input_json}, id:event.id});
    console.log("res",res);
    ret_data = {"id":res.body._id, "result":{"status":2,"status_text":"featured category is not enabled for this item"}};

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
  return callback(null, response);
};
module.exports.postDeals = async function(event, context, callback) {

  URL = 'https://flexi-deal-pictures.s3-ap-southeast-2.amazonaws.com/'; 

  let semevent = event;
  delete semevent.headers.Authorization;
  try{
    let dom = jwtdecode(event.headers.Authorization.replace("Bearer ", ""))
  console.log("UserInfo:",dom,"Event:",semevent,"Messege: Add Deals");
  }
  catch{
    console.log("Event:",semevent,"Messege: Add Deals");
  }

  statusCode = 200;
  result = "success";
  result_len = 0;
 ret_data = {};
  let srindname = "service_requests"; 
let srdoc = event.input_json;
              srdoc.added = Math.round(Date.now()/1000);
              try
              {
              let new_id = null;
              if (event.hasOwnProperty('id')  && event.id.length > 0)
              {
                  new_id = event.id;
              }
              let res = await client.index({index:srindname, body:srdoc, id:new_id});
              ret_data = {"id":res.body._id};  
              }
              catch(err)
              {
                console.log(err)
                statusCode = err.statusCode;
                result = "error";
                result_len = 0;
              }
 

  // console.log("HERE");
  var current_index = 'deal';
  var current_folder = 'pictures_uat';
            
  //upload main file
  //generate link
  //upload other files
  //generate links
  //generate object
  //add object
  //return id

// BD2  -------------------------------------------------------------

if (event.input_json.hasOwnProperty('featured'))
{
 if (event.input_json.featured.hasOwnProperty('picture') )
 {                       

   let main_file_content_feature = parse_image(event.input_json.featured.picture);
   let main_file_name_feature = await generate_unique_name("flexi-deal-pictures",current_folder,'png');

     // var s3_response = await s3.putObject({Bucket:"flexi-deal-pictures", Key:main_file_name_feature, Body:main_file_content_feature.data}).promise();
     var s3_response = await s3.putObject({ ContentType:'png',Bucket:"flexi-deal-pictures",Key:main_file_name_feature, Body:main_file_content_feature.data}).promise();
     
     console.log("deal_picture_featured",s3_response,main_file_name_feature);
     
     event.input_json.featured.picture = URL + main_file_name_feature;                        
     console.log( event.input_json.featured.picture)  
     // console.log("URL_feautre_deal",doc.image_url);
   
   }                                           
 }

// BD2  --------------------------------END-----------------------------


 var main_file_content = parse_image(event.input_json.marketplace_image.body);
 
 var main_file_name = await generate_unique_name("flexi-deal-pictures",current_folder,'png');
 
 // var main_file_name = await generate_unique_name("flexi-deal-pictures",current_folder,main_file_content.extension);
 var images_arr = [];
 /*
 for(var i = 0; i < event.input_json.images.length; i++)
 {
   var tmp_file_content = parse_image(event.input_json.images[i].body);
   var tmp_file_name = await generate_unique_name("flexi-deal-pictures",current_folder,tmp_file_content.extension);
   images_arr.push({data:tmp_file_content.data,name:tmp_file_name});
 }
 */
 
//console.log("IMAGE",main_file_content);
 try {
   
    var s3_response = await s3.putObject({ ContentType:'png',Bucket:"flexi-deal-pictures",
    Key:main_file_name, Body:main_file_content.data}).promise();
    
   // var s3_response = await s3.putObject({Bucket:"flexi-deal-pictures", Key:main_file_name, Body:main_file_content.data}).promise();
   console.log("tmp0",s3_response,main_file_name);
   for(var i = 0; i < images_arr.length; i++)
   {
     var tmp = await s3.putObject({Bucket:"flexi-deal-pictures", Key:images_arr[i].name, Body:images_arr[i].data}).promise();
     console.log("tmp",tmp,images_arr[i].name);
   }
  
   var doc = event.input_json;
   delete doc.images;
   delete doc.marketplace_image;
   doc.marketplace_image_url = URL + main_file_name;
   console.log("URL",doc.marketplace_image_url);
   var images_url = [];
   for(var i = 0; i < images_arr.length; i++)
   {
     images_url.push({url:URL+images_arr[i].name});
   }
   
   doc.images_url = images_url;
   doc.created = Date.now();
   doc.modified = Date.now();
   doc.end_time = doc.end_time + 24*3600-1;
                         
   if (doc.hasOwnProperty('featured'))
   {
     doc["featured"]['featured_end_time'] += 24*3600-1;
   }
   
   if (!doc.hasOwnProperty('archived'))
   {
     doc["archived"] = 0;
   }
   
   if (!doc.hasOwnProperty('inactive'))
   {
     doc["inactive"] = 0;
   }
                         
  
   if (!doc.hasOwnProperty('tag'))
   {
     doc["tag"] = 1;
   }
   //doc['archived'] = 0;
   //doc['inactive'] = 0;
   //console.log("DOC",doc);
   var res = await client.index({index:current_index, body:doc});
   //console.log("res",res);
   ret_data = {"id":res.body._id, "result":{"status":2,"status_text":"featured category is not enabled for this item"}};
   statusCode = 200;
   result = "success";
   result_len = 1;
 } catch (err) {
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
module.exports.countDeals = async function(event, context, callback) {
  let semevent = event;
  delete semevent.headers.Authorization;
    // const jaiswal = resultoo.find(it => it.apikey == event.headers['x-api-key']);
    // if (JSON.stringify(jaiswal) == null ) 
    // {
    //   return callback(null, { statusCode: 401, body: 'apikey not found', headers: { 'Content-Type': 'text/plain' } });
    // }
    try{
      let dom = jwtdecode(event.headers.Authorization.replace("Bearer ", ""))
      console.log("UserInfo:",dom,"Event:",semevent,"Messege: count Deals");
      }
      catch{
        console.log("Event:",semevent,"Messege: count Deals");
      }


    statusCode = 200;
    result = "success";
    result_len = 0;
   ret_data = {};
    let time_key = 'created';
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
    
      console.log(event.time)

      let time_query = {};
      console.log(parseInt(event.time)*1000)
      time_query[time_key] = {gte:parseInt(event.time)*1000};
     
      let current_index='deal';
      let ret_result =  await client.search({index:current_index,body:{query:{range:time_query }},  size: 0, track_total_hits:true});
      ret_data = {'count':ret_result.body.hits.total.value};
      result_len = 1;
      status="success"
    } catch(err)
    {

      console.error(err)
       statusCode = 500;
       result = "error " + err.statusCode;
       status="error"
    }
   
    const response = {
      statusCode: statusCode,
      status: result,
      result_length: result_len,
      body: ret_data
    }; 
    return callback(null, response);
};
module.exports.countDealss = async function(event, context, callback) {
  let semevent = event;
  delete semevent.headers.Authorization;
  try{
    let dom = jwtdecode(event.headers.Authorization.replace("Bearer ", ""))
    console.log("UserInfo:",dom,"Event:",semevent,"Message: Count Deals for public users");
    }
    catch{
      console.log("Event:",semevent,"Message: Count Deals for public users");
    }
  const jaiswal = resultoo.find(it => it.apikey == event.headers['x-api-key']);
  if (JSON.stringify(jaiswal) == null ) 
  {
    return callback(null, { statusCode: 401, body: 'apikey not found', headers: { 'Content-Type': 'text/plain' } });
  }

  statusCode = 200;
  result = "success";
  result_len = 0;
 ret_data = {};
  let time_key = 'created';
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
  
    console.log(event.time)

    let time_query = {};
    console.log(parseInt(event.time)*1000)
    time_query[time_key] = {gte:parseInt(event.time)*1000};
   
    let current_index='deal';
    let ret_result =  await client.search({index:current_index,body:{query:{range:time_query }},  size: 0, track_total_hits:true});
    ret_data = {'count':ret_result.body.hits.total.value};
    result_len = 1;
    status="success"
  } catch(err)
  {

    console.error(err)
     statusCode = 500;
     result = "error " + err.statusCode;
     status="error"
  }
 
  const response = {
    statusCode: statusCode,
    status: result,
    result_length: result_len,
    body: ret_data
  }; 
  return callback(null, response);
};
module.exports.searchDeals = async function(event, context, callback) {
  // let semevent = event;
  // delete semevent.headers.Authorization;
  // try{
  //   let dom = jwtdecode(event.headers.Authorization.replace("Bearer ", ""))
  //   console.log("UserInfo:",dom,"Event:",semevent,"Message: Search Deals dashboard");
  //   }
  //   catch{
  //     console.log("Event:",semevent,"Message: Search Deals dashboard");
  //   }
// const jaiswal = resultoo.find(it => it.apikey == event.headers['x-api-key']);
// if (JSON.stringify(jaiswal) == null ) 
// {
// return callback(null, { statusCode: 401, body: 'apikey not found', headers: { 'Content-Type': 'text/plain' } });
// }
 statusCode = 200;
 result = "success";
 result_len = 0;
 ret_data = {};
  let active_bool;
if (event.hasOwnProperty('fields'))  
{
var fields = event.fields.split(",");
if (fields.Length <= 0)
{
var statusCode = 200;
var result = "success";
var result_len = 0;
var ret_data = {};
}
}
// return "search deals"
active_t_now = Math.round(Date.now()/1000);
semevent = event;
  delete semevent.headers.Authorization;
  try{
    let dom = jwtdecode(event.headers.Authorization.replace("Bearer ", ""))
    console.log("UserInfo:",JSON.stringify(dom),"Event:",JSON.stringify(semevent),"Message: Search Deals api");
    }
    catch{
      console.log("Event:",JSON.stringify(semevent),"Message: Search Deals api");
    }
    
search_index_name = 'deal'
// const jaiswal = resultoo.find(it => it.apikey == event.headers['x-api-key']);
// if (JSON.stringify(jaiswal) == null ) 
// {
// return callback(null, { statusCode: 401, body: 'apikey not found', headers: { 'Content-Type': 'text/plain' } });
// }
 statusCode = 200;
 result = "success";
 result_len = 0;
 ret_data = {};
  
if (event.hasOwnProperty('fields'))  
{
var fields = event.fields.split(",");
if (fields.Length <= 0)
{
var statusCode = 200;
var result = "success";
var result_len = 0;
var ret_data = {};
}
}
ret_data = "executing search";
    var bool_query = [];
    var min_score = 0;
    var ids_dict = {};
    var search_index_name = "deal";
    
    //   static query
      
    // check activity of the deal
      
      if ( !event.hasOwnProperty('valid_time') || ( event.hasOwnProperty('valid_time') && ( (event.valid_time == 'current') || (event.valid_time.length == 0) ) ) )
      {
       active_bool =  {
        bool: {
          filter: [
            {
              range: {
                start_time:{
                  lte:active_t_now
                }
              }
            },
            {
              range: {
                end_time:{
                  gte:active_t_now
                }
              }
            }
          ]
        }
      
      };
      
      } else if ((event.hasOwnProperty('valid_time') && event.valid_time == 'future'))
      {
              active_bool =  {
        bool: {
          filter: [
            {
              range: {
                start_time:{
                  gte:active_t_now
                }
              }
            }
          ]
        }
      
      };  
      }
      else if ((event.hasOwnProperty('valid_time') && event.valid_time == 'past'))
      {
        active_bool =  {
        bool: {
          filter: [
            {
              range: {
                end_time:{
                  lte:active_t_now
                }
              }
            }
          ]
        }
      
      };  
      }
      
  console.log("datagetwithquery")    
      // BD
  if(event.hasOwnProperty("dashboard") && event.dashboard==1)
    {
      console.log("dashboard")
      active_bool=  {match_all : {}}
    }
      
      bool_query.push(active_bool);
    //
//
// _______________________________________________ global execute __________________________
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
// body_q['sort'] = {added:{order:'asc'}}
console.log("executing ",JSON.stringify(body_q),search_index_name);
let ret_result =  await client.search({index: search_index_name, body:body_q, from : from, size:size, _source:fields});
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
result = "error";
result_len = 0;
  
}
  const response = {
  statusCode: statusCode,
  status: result,
  result_length: result_len,
  body: ret_data}
  console.log(JSON.stringify(ret_data))
  return callback(null, response);
};

module.exports.searchDealss = async function(event, context, callback) {
  // let semevent = event;
// delete semevent.headers.Authorization;
// try{
//   let dom = jwtdecode(event.headers.Authorization.replace("Bearer ", ""))
//   console.log("UserInfo:",dom,"Event:",semevent,"Message: Search Deals dashboard");
//   }
//   catch{
//     console.log("Event:",semevent,"Message: Search Deals dashboard");
//   }
// const jaiswal = resultoo.find(it => it.apikey == event.headers['x-api-key']);
// if (JSON.stringify(jaiswal) == null ) 
// {
// return callback(null, { statusCode: 401, body: 'apikey not found', headers: { 'Content-Type': 'text/plain' } });
// }
statusCode = 200;
result = "success";
result_len = 0;
ret_data = {};
let active_bool;
if (event.hasOwnProperty('fields'))  
{
var fields = event.fields.split(",");
if (fields.Length <= 0)
{
var statusCode = 200;
var result = "success";
var result_len = 0;
var ret_data = {};
}
}
// return "search deals"
active_t_now = Math.round(Date.now()/1000);
semevent = event;
delete semevent.headers.Authorization;
try{
  let dom = jwtdecode(event.headers.Authorization.replace("Bearer ", ""))
  console.log("UserInfo:",JSON.stringify(dom),"Event:",JSON.stringify(semevent),"Message: Search Deals api");
  }
  catch{
    console.log("Event:",JSON.stringify(semevent),"Message: Search Deals api");
  }
  
search_index_name = 'deal'
// const jaiswal = resultoo.find(it => it.apikey == event.headers['x-api-key']);
// if (JSON.stringify(jaiswal) == null ) 
// {
// return callback(null, { statusCode: 401, body: 'apikey not found', headers: { 'Content-Type': 'text/plain' } });
// }
statusCode = 200;
result = "success";
result_len = 0;
ret_data = {};

if (event.hasOwnProperty('fields'))  
{
var fields = event.fields.split(",");
if (fields.Length <= 0)
{
var statusCode = 200;
var result = "success";
var result_len = 0;
var ret_data = {};
}
}
ret_data = "executing search";
  var bool_query = [];
  var min_score = 0;
  var ids_dict = {};
  var search_index_name = "deal";
  
  //   static query
    
  // check activity of the deal
    
    if ( !event.hasOwnProperty('valid_time') || ( event.hasOwnProperty('valid_time') && ( (event.valid_time == 'current') || (event.valid_time.length == 0) ) ) )
    {
     active_bool =  {
      bool: {
        filter: [
          {
            range: {
              start_time:{
                lte:active_t_now
              }
            }
          },
          {
            range: {
              end_time:{
                gte:active_t_now
              }
            }
          }
        ]
      }
    
    };
    
    } else if ((event.hasOwnProperty('valid_time') && event.valid_time == 'future'))
    {
            active_bool =  {
      bool: {
        filter: [
          {
            range: {
              start_time:{
                gte:active_t_now
              }
            }
          }
        ]
      }
    
    };  
    }
    else if ((event.hasOwnProperty('valid_time') && event.valid_time == 'past'))
    {
      active_bool =  {
      bool: {
        filter: [
          {
            range: {
              end_time:{
                lte:active_t_now
              }
            }
          }
        ]
      }
    
    };  
    }
    
console.log("datagetwithquery")    
    // BD
if(event.hasOwnProperty("dashboard") && event.dashboard==1)
  {
    console.log("dashboard")
    active_bool=  {match_all : {}}
  }
    
    bool_query.push(active_bool);
  //
//
// _______________________________________________ global execute __________________________
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
if (event.requesttype=="deal")
{
  if(event.filter == 'featured_all' || event.filter == 'featured'){
  if (event.app != 'all')
    {
if(event.app == 'a:bundll'){
body_q['sort'] = {bundllsort:{order:'asc'}}
}
if(event.app == 'a:hummpro'){
body_q['sort'] = {hummprosort:{order:'asc'}}
}
if(event.app == 'a:humm90'){
body_q['sort'] = {humm90sort:{order:'asc'}}
}
    }else{
      body_q['sort'] = {order:{order:'asc'}}
    }
  }
  // body_q['sort'] = {order:{order:'asc'}}
  console.log("executing111 ",JSON.stringify(body_q))
}
// body_q['sort'] = {added:{order:'asc'}}
console.log("executing ",JSON.stringify(body_q),search_index_name);
let ret_result =  await client.search({index: search_index_name, body:body_q, from : from, size:size, _source:fields});
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
result = "error";
result_len = 0;

}
const response = {
statusCode: statusCode,
status: result,
result_length: result_len,
body: ret_data}
console.log(JSON.stringify(ret_data))
return callback(null, response);
};
module.exports.getByIdDeals = async function(event, context, callback) {
  let semevent = event;
  delete semevent.headers.Authorization;
  try{
    let dom = jwtdecode(event.headers.Authorization.replace("Bearer ", ""))
    console.log("UserInfo:",dom,"Event:",semevent,"Message: Get Deal By Id Dashboard");
    }
    catch{
      console.log("Event:",semevent,"Message: Get Deal By Id Dashboard");
    }
// console.log("UserInfo:",dom,"Event:",semevent,"Messege: Get Deal By Id Dashboard");
  // const jaiswal = resultoo.find(it => it.apikey == event.headers['x-api-key']);
  // if (JSON.stringify(jaiswal) == null ) 
  // {
  // return callback(null, { statusCode: 401, body: 'apikey not found', headers: { 'Content-Type': 'text/plain' } });
  // }
  
var statusCode = 200;
var result = "success";
var result_len = 0;
var ret_data = {};

if (event.hasOwnProperty('fields'))  
{
var fields = event.fields.split(",");
if (fields.Length <= 0)
{
var statusCode = 200;
var result = "success";
var result_len = 0;
var ret_data = {};

}
}
    var index_name = 'deal';
    let item_error = 0;
    let store_dname = "";
    
    try
    {
      let app_id = '';
      if (event.hasOwnProperty('app') && ['a:humm', 'a:bundll', 'a:humm90', 'a:hummpro'].includes(event.app))
      {
        app_id = event.app;
      }
      
      await client.index({index:"stats_popularity", body:{user:event.userid, item_type:popularity_search_nostage, item_id:event.id,added:Date.now(), app:app_id}});
 
    }
    catch(err){
      console.error(err)
    }
    
    try {
     let ret_result =  await client.get({index:index_name, id:event.id});
     

     //check validity. todo: edit field names and types inside the API (make "getbyid" and "requesttype")
     if (event.request == "getbyid")
     {
       try{
         
         let current_store =  ret_result.body._source.source;
         console.log(current_store);
         let store_res = await client.search({index:index_name,_source_includes :["inactive","archived","source_display_name"],body:{query: {match: {"name.keyword": current_store}}}  } );

         if (store_res.body.hits.hits.length == 0)
         {
   
         
           item_error = 1;
         }
         else{

    
           store_dname = store_res.body.hits.hits[0]._source.source_display_name;
           ret_result.body._source.source_display_name = store_dname;
          if (store_res.body.hits.hits[0]._source.archived != 0 || store_res.body.hits.hits[0]._source.inactive == 1 )
         {
           item_error = 2;
         }           
         }

       
          }
       catch(err)
         {
          console.error(err)
           item_error = 3;
         }
     }
     
     //check validity end
     
     //check deal valid time
     if (event.request == "getdealbyid" && event.hasOwnProperty('unprotected') && event.unprotected == 'B6Ed9PkwxB94gsKk')
     {

     }
     else if (event.request == "getdealbyid")
     {

        let st_time = ret_result.body._source.start_time;
        let end_time = ret_result.body._source.end_time;
        console.log(st_time, end_time);
        let active_t_now = Math.round(Date.now()/1000);
        
        if (active_t_now < st_time || active_t_now > end_time)
        {
          item_error = 5;
        }
     }

     ///end check deal valid time
     if (item_error == 0)
     {

     ret_data = ret_result.body._source;
     ret_data.id = ret_result.body._id;
     result_len = 1;
     
     //cut fields
     var ret_data_cut = {};
     ret_data_cut = cut_fields(fields, ret_data);
     ret_data_cut['id'] = ret_data['id'];

     ret_data = [ret_data_cut];
     } else
     {
    statusCode = 404;
    result = "error, the item does not exist (inactive/archived/expired)";
    result_len = 0;
     }
     ////
    } 
    catch(err)
    {

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
module.exports.getByIdDealss = async function(event, context, callback) {
  let semevent = event;
  delete semevent.headers.Authorization;
  try{
    let dom = jwtdecode(event.headers.Authorization.replace("Bearer ", ""))
    console.log("UserInfo:",dom,"Event:",semevent,"Messege: Get Deal By Id API");
  }
    catch{
      console.log("Event:",semevent,"Message: Get Deal By Id API");
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

if (event.hasOwnProperty('fields'))  
{
var fields = event.fields.split(",");
if (fields.Length <= 0)
{
var statusCode = 200;
var result = "success";
var result_len = 0;
var ret_data = {};
}
}
    var index_name = 'deal';
    let item_error = 0;
    let store_dname = "";
    
    try
    {
      let app_id = '';
      if (event.hasOwnProperty('app') && ['a:humm', 'a:bundll', 'a:humm90', 'a:hummpro'].includes(event.app))
      {
        app_id = event.app;
      }
      
      await client.index({index:"stats_popularity", body:{user:event.userid, item_type:popularity_search_nostage, item_id:event.id,added:Date.now(), app:app_id}});
 
    }
    catch(err){
      
    }
    
    try {
     let ret_result =  await client.get({index:index_name, id:event.id});
     

     //check validity. todo: edit field names and types inside the API (make "getbyid" and "requesttype")
     if (event.request == "getbyid")
     {
       try{
         
         let current_store =  ret_result.body._source.source;
         console.log(current_store);
         let store_res = await client.search({index:index_name,_source_includes :["inactive","archived","source_display_name"],body:{query: {match: {"name.keyword": current_store}}}  } );

         if (store_res.body.hits.hits.length == 0)
         {
   
         
           item_error = 1;
         }
         else{

    
           store_dname = store_res.body.hits.hits[0]._source.source_display_name;
           ret_result.body._source.source_display_name = store_dname;
          if (store_res.body.hits.hits[0]._source.archived != 0 || store_res.body.hits.hits[0]._source.inactive == 1 )
         {
           item_error = 2;
         }           
         }

       
          }
       catch(err)
         {
          console.error(err)
           item_error = 3;
         }
     }
     
     //check validity end
     
     //check deal valid time
     if (event.request == "getdealbyid" && event.hasOwnProperty('unprotected') && event.unprotected == 'B6Ed9PkwxB94gsKk')
     {

     }
     else if (event.request == "getdealbyid")
     {

        let st_time = ret_result.body._source.start_time;
        let end_time = ret_result.body._source.end_time;
        console.log(st_time, end_time);
        let active_t_now = Math.round(Date.now()/1000);
        
        if (active_t_now < st_time || active_t_now > end_time)
        {
          item_error = 5;
        }
     }

     ///end check deal valid time
     if (item_error == 0)
     {

     ret_data = ret_result.body._source;
     ret_data.id = ret_result.body._id;
     result_len = 1;
     
     //cut fields
     var ret_data_cut = {};
     ret_data_cut = cut_fields(fields, ret_data);
     ret_data_cut['id'] = ret_data['id'];


     ret_data = [ret_data_cut];

     } else
     {
    statusCode = 404;
    result = "error, the item does not exist (inactive/archived/expired)";
    result_len = 0;
     }
     ////
    } 
    catch(err)
    {
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
    return callback(null, response);
};
module.exports.sort = async function(event, context, callback) {
//   let semevent = event;
//   delete semevent.headers.Authorization;
//   try{
//     let dom = jwtdecode(event.headers.Authorization.replace("Bearer ", ""))
//   console.log("UserInfo:",dom,"Event:",semevent,"Messege: Sort Deals Dashboard");
// }catch{
//   console.log("Event:",semevent,"Messege: Sort Deals Dashboard");

// }
for (var j = 0; j < event.input_json.orders.deals.length; j++)
{
 doc= null
doc= await client.get({ index: "deal", id: event.input_json.orders.deals[j].id }); 
doc.body._source['order'] = event.input_json.orders.deals[j].order;
if(event.app == 'a:bundll'){
  doc.body._source['bundllsort'] = event.input_json.orders.deals[j].order;
}

if(event.app == 'a:hummpro'){
  doc.body._source['hummprosort'] = event.input_json.orders.deals[j].order;
}

if(event.app == 'a:humm90'){
  doc.body._source['humm90sort'] = event.input_json.orders.deals[j].order;
}

var pubs = await client.update({index:"deal",body:{doc:doc.body._source}, id: event.input_json.orders.deals[j].id}); 
}
const response = {
  statusCode: 201,
  status: "sorted",
  result_length: 0,
  body: {}
}; 
return callback(null,JSON.stringify(response));
};