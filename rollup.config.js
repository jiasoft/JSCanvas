"use strict";

import pck from "./package.json"
export default {
    // 核心选项
    input:"src/index.js",     // 必须
    
  
    output: {  // 必须 (如果要输出多个，可以是一个数组)
      // 核心选项
      file:"./dist/jf.js",    // 必须
      format:"umd",  // 必须
      name:"MyBundle",
     
      banner:
`/**
* version:${pck.version},
* name:${pck.name},
* author:${pck.author}
* created:2021/12/7
* update:${new Date()}
* */
`,
      sourcemap:true,
      interop:`/* ----interop---- */`,
      footer:`/* ----footer---- */`,
      intro:`/* ----intro---- */`,
      outro:`debugger;exports.JF.version = "${pck.version}";window.JF = exports.JF`
    
      
    },
  };