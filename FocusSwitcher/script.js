
import { template_dark } from './main.js';
import { template_default } from './main.js';
import { template_light } from './main.js';
import { uuidv4 } from './main.js';
import { truncate } from './main.js';

import { chrome_get } from './scripts/chrome.js';
import { chrome_set } from './scripts/chrome.js';

var blocker_form = document.getElementById('blocker-form');
var blocked_websites = document.getElementById('blocked-websites');
var website_url_error = document.getElementById('website-url-error');
var redirect_url_text = null;
var current_template = template_default;
let blocked_websites_count = 0;
let blocked_websites_arr = [];

chrome_get('blocked_websites').then(chrome_result_blocked_websites=>{
    if(chrome_result_blocked_websites != undefined && chrome_result_blocked_websites != ''){
        blocked_websites_arr = chrome_result_blocked_websites
    }
});

blocked_website_load();

if(blocked_websites_count == 0){
    document.querySelector('#blocked-websites li').style.display = 'block';
}else{
    document.querySelector('#blocked-websites li').style.display = 'none';
}

blocker_form.onsubmit = function(e){
    
    e.preventDefault();

    var website_url = document.getElementById('website-url');
    var redirect_url = document.getElementById("redirect-url");
    var blocked_website_element = document.getElementById('blocked-website-element')
    var operation = document.getElementById('operation')
    var blocked_website_element_id = null;

    if(blocked_website_element.value != ''){
        blocked_website_element_id = blocked_website_element.value;
    }else{
        blocked_website_element_id = uuidv4();
    }

    if(website_url.value == ''){
        website_url_error.innerHTML = 'Cannot be empty';
        website_url_error.classList.replace('validation','validation-alert');
        return;
    }else{
        website_url_error.innerHTML = '';
        website_url_error.classList.replace('validation-alert','validation');
    }

    if(redirect_url.value != ''){
        redirect_url_text = redirect_url.value;
    }

    var blocked_website_obj = {
        'blocked_website': website_url.value,
        'redirect_url': redirect_url_text,
        'id': blocked_website_element_id,
        'is_blur': false
    };

    if(blocked_website_element.value != ''){
        var exist_blocked_website_index = blocked_websites_arr.findIndex(item => item.id == blocked_website_element_id);

        if(exist_blocked_website_index != -1){
            var exist_blocked_website_obj = blocked_websites_arr[exist_blocked_website_index];
            blocked_website_obj.is_blur = exist_blocked_website_obj.is_blur;
            blocked_websites_arr[exist_blocked_website_index] = blocked_website_obj;

            var exist_blocked_website = document.getElementById(`blocked-website-${blocked_website_element_id}`);
            exist_blocked_website.firstChild.textContent = truncate(blocked_website_obj.blocked_website,20); 

        }else{
            blocked_websites_arr.push(blocked_website_obj);
            insert_blocked_website(website_url.value, blocked_website_element_id);
        }

    }else{
        blocked_websites_arr.push(blocked_website_obj);
        insert_blocked_website(website_url.value, blocked_website_element_id);
    }

    chrome_set('blocked_websites', blocked_websites_arr)
    
    website_url.value = null;
    redirect_url.value = null;
    blocked_website_element.value = null;

    operation.innerText = 'Add'
}


function blocked_website_load(){

    chrome_get('blocked_websites').then(chrome_result_blocked_websites=>{
        if(chrome_result_blocked_websites != undefined && chrome_result_blocked_websites != ''){
            if(chrome_result_blocked_websites != undefined && chrome_result_blocked_websites != ''){
                blocked_websites_arr = chrome_result_blocked_websites;
            }else{
                blocked_websites_arr = [];
            }
            if(blocked_websites_arr.length > 0){
                document.querySelector('#blocked-websites .no-website').style.display = 'none';
                blocked_websites_arr.forEach(x=>{
                    insert_blocked_website(x.blocked_website, x.id);
                })
                blocked_websites_count = blocked_websites_arr.length;
            }else{
                document.querySelector('#blocked-websites .no-website').style.display = 'block';
            }
        }
    
    });
}


function insert_blocked_website(text, blocked_website_element_id){
    var blocked_website_li = document.createElement('li');
    var blocked_website_edit_icon = document.createElement('i');
    var blocked_website_remove_icon = document.createElement('i');
    var blocked_website_blur_icon = document.createElement('i');
    var blocked_website_li_text = document.createElement('span');

    if(blocked_website_element_id === null){
        blocked_website_element_id = uuidv4();
    }

    blocked_website_li_text.innerText = truncate(text,20);
    
    blocked_website_li.style.color = current_template.liTextColor;
    blocked_website_li.style.backgroundColor = current_template.liBg;
    blocked_website_li.classList.add('blocked_website');
    blocked_website_li.id = `blocked-website-${blocked_website_element_id}`

    blocked_website_edit_icon.className = 'bi bi-pencil-square pointer';
    blocked_website_edit_icon.style.float = "right"
    blocked_website_edit_icon.id = "blocked-website-edit"
    blocked_website_edit_icon.onclick = function(){
        blocked_website_edit_click(blocked_website_element_id);
    }

    blocked_website_remove_icon.className = 'bi bi-x-circle color-danger pointer';
    blocked_website_remove_icon.style.float = "right";
    blocked_website_remove_icon.style.marginRight = '10px';
    blocked_website_remove_icon.id = "blocked-website-remove"
    blocked_website_remove_icon.onclick = function () {
        blocked_website_remove_click(blocked_website_element_id,blocked_website_li);
    };
    
    blocked_website_blur_icon.className = 'bi bi-eye-slash pointer';
    blocked_website_blur_icon.style.float = "right";
    blocked_website_blur_icon.style.marginRight = '10px';
    blocked_website_blur_icon.id = "blocked-website-blur"
    blocked_website_blur_icon.onclick = function () {
        blocked_website_blur_click(blocked_website_element_id,blocked_website_li);
    };

    blocked_website_li.appendChild(blocked_website_li_text)
    blocked_website_li.appendChild(blocked_website_edit_icon)
    blocked_website_li.appendChild(blocked_website_remove_icon)
    blocked_website_li.appendChild(blocked_website_blur_icon)

    blocked_websites.append(blocked_website_li);
    blocked_websites_count++;

    var exist_blocked_website_index = blocked_websites_arr.findIndex(item => item.id == blocked_website_element_id);
    var blocked_website_obj = blocked_websites_arr[exist_blocked_website_index];

    if(blocked_website_obj.is_blur){
        changeBlur(blocked_website_element_id,true);
    }else{
        changeBlur(blocked_website_element_id,false);
    }

    document.querySelector('#blocked-websites .no-website').style.display = 'none';
}

function blocked_website_remove_click(blocked_website_element_id,blocked_website_li){
    blocked_websites_arr = blocked_websites_arr.filter(item => item.id != blocked_website_element_id);
    chrome_set('blocked_websites', blocked_websites_arr)

    blocked_website_li.remove();
    blocked_websites_count = blocked_websites_arr.length;

    if(blocked_websites_count == 0){
        document.querySelector('#blocked-websites .no-website').style.display = 'block';
    }
}

function blocked_website_edit_click(blocked_website_element_id){
    var blocked_website_obj = blocked_websites_arr.filter(item => item.id == blocked_website_element_id)[0];

    var website_url = document.getElementById('website-url');
    var redirect_url = document.getElementById('redirect-url');
    var blocked_website_element = document.getElementById('blocked-website-element')
    var operation = document.getElementById('operation')
    
    website_url.value = blocked_website_obj.blocked_website;
    redirect_url.value = blocked_website_obj.redirect_url;
    blocked_website_element.value = blocked_website_element_id;
    operation.innerText = 'Update'
}

function blocked_website_blur_click(blocked_website_element_id){
    var blocked_website_text = document.querySelector(`#blocked-website-${blocked_website_element_id} span`);
    blocked_website_text.classList.toggle('blur');

    if(blocked_website_text.classList.contains('blur')){
        changeBlur(blocked_website_element_id,true);
    }else{
        changeBlur(blocked_website_element_id,false);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const templates = document.querySelectorAll('.template');
    const wrapper = document.querySelector('.wrapper');
    const header = document.querySelector('.header');
    const footer = document.querySelector('.footer');
    const body = document.body;
    const buttons = document.querySelectorAll('button');
    const listItems = document.querySelectorAll('#blocked-websites li');
    const inputs = document.querySelectorAll('input[type="text"]');
    const head_logo = document.getElementById('head-logo');

    chrome_get('template_style').then(chrome_result_template_style=>{
        if(chrome_result_template_style != undefined && chrome_result_template_style != ""){
            switch (chrome_result_template_style){
                case 'default':
                    applyTemplate(template_default);
                    current_template = template_default;
                    break;
                case 'light':
                    applyTemplate(template_light);
                    current_template = template_light;
                    break;
                case 'dark':
                    applyTemplate(template_dark);
                    current_template = template_dark;
                    break;    
                default:
                    break;
            }
        }
    });
    
    templates.forEach(template => {
      template.addEventListener('click', () => {
        const selectedTemplate = template.dataset.template;
        switch (selectedTemplate) {
          case 'default':
            applyTemplate(template_default);
            current_template = template_default;
            chrome_set('template_style', 'default')
            break;
  
          case 'light':
            applyTemplate(template_light);
            current_template = template_light;
            chrome_set('template_style', 'light')
            break;
  
          case 'dark':
            applyTemplate(template_dark);
            current_template = template_dark;
            chrome_set('template_style', 'dark')
            break;
          default:
            break;
        }
      });
    });
  
    function applyTemplate({
      bodyBg,
      wrapperBg,
      headerFooterBg,
      textColor,
      buttonBg,
      buttonText,
      liBg,
      liTextColor,
      inputBg,
      inputTextColor,
      inputPlaceholderColor,
      logoSrc
    }) {
      body.style.background = bodyBg;
      wrapper.style.background = wrapperBg;
      header.style.background = headerFooterBg;
      footer.style.background = headerFooterBg;
      document.querySelectorAll('.template-element').forEach(el => {
        el.style.color = textColor;
      });
      buttons.forEach(button => {
        button.style.background = buttonBg;
        button.style.color = buttonText;
      });
      document.querySelectorAll('#blocked-websites li').forEach(li => {
        li.style.background = liBg;
        li.style.color = liTextColor;
      });
      inputs.forEach(input => {
        input.style.background = inputBg;
        input.style.color = inputTextColor;
        input.style.border = 'none';
        input.style.borderRadius = '8px';
      });
      const styleSheet = document.styleSheets[0];
      styleSheet.insertRule(
        `input[type="text"]::placeholder { color: ${inputPlaceholderColor}; }`,
        styleSheet.cssRules.length
      );
      head_logo.src = logoSrc;
    }
});

function changeBlur(blocked_website_element_id, is_blur){
    var blocked_website_li = document.querySelector(`#blocked-website-${blocked_website_element_id}`);
    var blocked_website_text = document.querySelector(`#blocked-website-${blocked_website_element_id} span`);
    var blocked_website_blur_icon = document.querySelector(`#blocked-website-${blocked_website_element_id} #blocked-website-blur`);
    var blocked_website_obj = blocked_websites_arr.filter(item => item.id == blocked_website_element_id)[0];
    var exist_blocked_website_index = blocked_websites_arr.findIndex(item => item.id == blocked_website_element_id);
    var canHold  = false;

    if(is_blur){
        blocked_website_blur_icon.classList.replace('bi-eye-slash','bi-eye');
        blocked_website_obj.is_blur = true;
        blocked_website_text.classList.add('blur')
    }else{
        blocked_website_blur_icon.classList.replace('bi-eye','bi-eye-slash');
        blocked_website_obj.is_blur = false;
        blocked_website_text.classList.remove('blur')
        canHold = true;
    }

    blocked_website_li.onselectstart = function(){ return canHold;}
    blocked_website_li.onmousedown = function(){ return canHold;}
    
    blocked_websites_arr[exist_blocked_website_index] = blocked_website_obj;
    chrome_set('blocked_websites', blocked_websites_arr)
}