

export var template_dark = {
  bodyBg: '#121212',        
  wrapperBg: '#1c1c1c',     
  headerFooterBg: '#2c2c2c', 
  textColor: '#e0e0e0',      
  buttonBg: '#555555',      
  buttonText: '#ffffff',     
  liBg: '#2c2c2c',          
  liTextColor: '#e0e0e0',    
  inputBg: '#2c2c2c',      
  inputTextColor: '#e0e0e0',
  inputPlaceholderColor: '#888888', 
  logoSrc: 'logo_2.png'
}


export var template_default = {
    bodyBg: 'linear-gradient(135deg, #6dd5ed, #2193b0)',
    wrapperBg: '#1b2a40',
    headerFooterBg: 'linear-gradient(135deg, #2193b0, #6dd5ed)',
    textColor: '#fff',
    buttonBg: 'linear-gradient(135deg, #6dd5ed, #2193b0)',
    buttonText: '#fff',
    liBg: '#2a3b57',
    liTextColor: '#fff',
    inputBg: '#2a3b57',
    inputTextColor: '#fff',
    inputPlaceholderColor: '#aaa',
    logoSrc: 'logo_2.png'
  }

  export var template_light = {
    bodyBg: '#f8f9fa',
    wrapperBg: '#ffffff',
    headerFooterBg: '#dee2e6',
    textColor: '#212529',
    buttonBg: '#adb5bd',
    buttonText: '#212529',
    liBg: '#e9ecef',
    liTextColor: '#212529',
    inputBg: '#f8f9fa',
    inputTextColor: '#212529',
    inputPlaceholderColor: '#6c757d',
    logoSrc: 'blue_bg.png'
  }
  

export function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}


export function truncate(string, length){
  if (string.length > length)
      return string.substring(0,length)+'...';
  else
      return string;
};