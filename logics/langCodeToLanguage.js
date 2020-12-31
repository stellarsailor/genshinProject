export default function langCodeToLanguage(langCode){
    if(langCode === 'en') return 'English'
    else if(langCode === 'ko') return '한국어'
    else if(langCode === 'jp') return '日本語'
    else if(langCode === 'cn') return '简体中文'
    else return ''
}