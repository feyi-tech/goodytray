import { SITE_NAME, SITE_TRADE_MARK } from "../utils/Constants";

export default ({ body, initialData }) => {
    return `
    <!DOCTYPE html>
<html lang="en">
  <head>
      <link rel="preconnect" href="https://maxcdn.bootstrapcdn.com/">
      <link rel="preconnect" href="https://www.google.com/">
      <link rel="preconnect" href="https://www.googleadservices.com/">
      <link rel="preconnect" href="https://www.googletagservices.com/">
      <link rel="preconnect" href="https://www.googletagmanager.com/">
      <link rel="preconnect" href="https://www.google-analytics.com/">
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
      <link href="/public/res/css/create_advert.module.css" type="text/css" rel="stylesheet">
      <link href="/public/res/css/desktop-create.css" type="text/css" rel="stylesheet">
      <link href="/public/res/css/styles.css" type="text/css" rel="stylesheet">
      
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#70b93f" />
      <link rel="apple-touch-icon" href="/public/logo.png" />
      <meta name="application-name" content="${SITE_NAME}">
      ${
        initialData.pageMeta == null || initialData.pageMeta.description == null?
        '<!--pageMeta.description-->':'<meta name="description" content="'+SITE_TRADE_MARK+" "+initialData.pageMeta.description+" | "+SITE_NAME+'">'
      }
      ${
        initialData.pageMeta == null || initialData.pageMeta.keywords == null?
        '<!--pageMeta.keywords-->':'<meta name="keywords" content="'+initialData.pageMeta.keywords+'">'
      }
      <meta property="og:title" content="${initialData.pageMeta.title}">
      ${
        initialData.pageMeta == null || initialData.pageMeta.url == null?
        '<!--pageMeta.url-->':'<meta property="og:url" content="'+initialData.pageMeta.url+'">'
      }
      ${
        initialData.pageMeta == null || initialData.pageMeta.description == null?
        '<!--pageMeta.description-->':'<meta property="og:description" content="'+initialData.pageMeta.description+'">'
      }
      ${
        initialData.pageMeta == null || initialData.pageMeta.image_type == null?
        '<!--pageMeta.image_type-->':'<meta property="og:image:type" content="'+initialData.pageMeta.image_type+'">'
      }
      ${
        initialData.pageMeta == null || initialData.pageMeta.image == null?
        '<!--pageMeta.image-->':'<meta property="og:image" content="'+initialData.pageMeta.image+'">'
      }
  
      ${
        initialData.pageMeta == null || initialData.pageMeta.url == null?
        '<!--pageMeta.url-->':'<link rel="canonical" content="'+initialData.pageMeta.url+'">'
      }
  
      <link rel="icon" href="/public/favicon.ico" type="image/x-icon" />
      <title>${initialData.pageMeta.title}</title>
      
      <script>window.__initialData__ = ${JSON.stringify(initialData)}</script>
  </head>
  <body class="DOMisLoaded AllIsLoaded">
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div class="js-gulp-svg-bundle">
      <svg class="h-hidden-force qa-svg-bundle" style="position: absolute;" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">
      <defs>
      <clipPath id="clip0"> <rect width="63" height="53" fill="white"></rect> </clipPath> 
       <clipPath id="clip1"> <rect width="431" height="424" fill="white"></rect> </clipPath> 
       <clipPath id="clip2"> <rect width="431" height="424" fill="white"></rect> </clipPath> 
       <clipPath id="clip3"> <rect width="431" height="424" fill="white"></rect> </clipPath> 
       <clipPath id="clip4"> <rect width="431" height="424" fill="white"></rect> </clipPath> 
       <clipPath id="clip5"> <rect width="431" height="424" fill="white"></rect> </clipPath> 
       <path id="negative-a" d="M.795.345H32.19v33.347H.795z"></path> <mask id="negative-b" fill="#fff"> <use xlink:href="#negative-a"></use> </mask> 
       <path id="neutral-a" d="M.795.345H32.19v33.347H.795z"></path> <mask id="neutral-b" fill="#fff"> <use xlink:href="#neutral-a"></use> </mask> 
       <path id="positive-a" d="M.795.345H32.19v33.347H.795z"></path> <mask id="positive-b" fill="#fff"> <use xlink:href="#positive-a"></use> </mask> 
       <path id="b" d="M71 6C54.12 6 40.265 17.335 39.194 31.612 23.118 32.397 8 43.687 8 58.957c0 6.38 2.593 12.564 7.313 17.463.933 3.75-.2 7.723-3.014 10.463a1.792 1.792 0 0 0-.406 1.99c.29.682.973 1.127 1.732 1.127 5.347 0 10.5-2.042 14.33-5.64 3.73 1.237 8.597 1.988 13.045 1.988 16.878 0 30.731-11.332 31.805-25.606 3.926-.17 8.01-.876 11.24-1.948 3.83 3.599 8.983 5.64 14.33 5.64.759 0 1.442-.444 1.732-1.126.29-.683.13-1.468-.406-1.99-2.814-2.74-3.947-6.714-3.013-10.463 4.72-4.9 7.312-11.082 7.312-17.464C104 17.525 87.718 6 71 6z"></path> <filter id="a" width="121.9%" height="125%" x="-9.9%" y="-10.1%" filterUnits="objectBoundingBox"> <feMorphology in="SourceAlpha" operator="dilate" radius="3.5" result="shadowSpreadOuter1"></feMorphology> <feOffset dx="1" dy="2" in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset> <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="2"></feGaussianBlur> <feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1"></feComposite> <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0.368627451 0 0 0 0 0.443137255 0 0 0 0 0.525490196 0 0 0 0.3 0"></feColorMatrix> </filter> 
       <clipPath id="clip0"> <rect width="28.75" height="25" fill="white" transform="translate(5 7.5)"></rect> </clipPath> 
       <clipPath id="clip0"> <rect width="27" height="23" fill="white" transform="translate(7 9)"></rect> </clipPath>
      </defs>
      <symbol id="logo-jiji" viewBox="0 0 230 222"> <path d="M128.013 222C159.833 218.205 171.696 198.869 171.696 168.51V46.5324H137.485V170.498C137.485 188.027 132.427 191.641 122.495 196.43L128.013 222Z" fill="inherit"></path> <path d="M154.683 37.3162C165.994 37.3162 174.731 29.9072 174.731 18.7937C174.731 7.58974 166.086 0 154.683 0C143.371 0 134.818 7.58974 134.818 18.7937C134.91 29.9072 143.371 37.3162 154.683 37.3162Z" fill="inherit"></path> <path d="M20.232 127.942C20.232 143.302 15.174 148.543 0 148.543V177.095C4.69013 177.727 8.46063 177.908 12.507 177.908C39.8202 177.908 56.0057 165.168 56.0057 132.189V42.467H20.232V127.942Z" fill="inherit"></path> <path d="M79.3644 177.456H113.943V73.6391H79.3644V177.456Z" fill="inherit"></path> <path d="M193.123 73.6391V177.456H227.701V73.6391H193.123Z" fill="inherit"></path> <path d="M230 42.466C230 31.8043 221.263 23.2206 210.412 23.2206C199.56 23.2206 190.824 31.8946 190.824 42.466C190.824 53.1278 199.56 61.7115 210.412 61.7115C221.263 61.7115 230 53.1278 230 42.466Z" fill="inherit"></path> <path d="M96.6538 23.2206C107.506 23.2206 116.242 31.8043 116.242 42.466C116.242 53.1278 107.506 61.7115 96.6538 61.7115C85.8022 61.7115 77.0657 53.1278 77.0657 42.466C77.0657 31.8946 85.8022 23.2206 96.6538 23.2206Z" fill="inherit"></path> </symbol>
      <symbol id="jiji-logo" viewBox="0 0 33 32"> <path d="M2.8186 18.4457C2.8186 20.6644 2.11395 21.4107 0 21.4107V25.5153C0.645103 25.6061 1.18104 25.6263 1.74674 25.6263C5.55781 25.6263 7.81071 23.7807 7.81071 19.0407V6.1217H2.8186V18.4457ZM11.0561 25.5758H15.8795V10.6197H11.0561V25.5758ZM26.9058 10.6197V25.5859H31.7292V10.6197H26.9058Z" fill="#353C42"></path> <path d="M17.8344 32C22.2608 31.4554 23.9281 28.6618 23.9281 24.2849V6.70659H19.1643V24.5774C19.1643 27.1087 18.4596 27.6231 17.0801 28.3189L17.8344 32ZM21.5561 5.37535C23.1341 5.37535 24.3449 4.30633 24.3449 2.7028C24.3449 1.08919 23.1341 0 21.5561 0C19.9781 0 18.797 1.08919 18.797 2.7028C18.797 4.31642 19.9781 5.37535 21.5561 5.37535Z" fill="#3DB83A"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M29.3177 3.34827C30.8262 3.34827 32.047 4.58873 32.047 6.12167C32.047 7.6546 30.8262 8.89507 29.3177 8.89507C27.8091 8.89507 26.5884 7.6546 26.5884 6.12167C26.5884 4.58873 27.8091 3.34827 29.3177 3.34827Z" fill="#FF4028"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M13.4676 3.34827C14.9761 3.34827 16.1969 4.58873 16.1969 6.12167C16.1969 7.6546 14.9761 8.89507 13.4676 8.89507C11.959 8.89507 10.7383 7.6546 10.7383 6.12167C10.7383 4.58873 11.959 3.34827 13.4676 3.34827Z" fill="#FFC112"></path> </symbol>
      <symbol id="logo-domain-ghana" viewBox="0 0 431 424"> <g clip-path="url(#clip1)"> <path fill-rule="evenodd" clip-rule="evenodd" d="M431.568 211.848C431.568 95.2109 335.101 0.542969 215.943 0.542969C96.9216 0.542969 0.318359 95.0778 0.318359 211.848C0.318359 328.619 96.9216 423.154 215.943 423.154C335.101 423.154 431.568 328.486 431.568 211.848ZM104.012 262.675C104.012 250.171 93.4718 240.195 80.5742 240.195C67.6767 240.195 57.1367 250.304 57.1367 262.675C57.1367 275.178 67.6767 285.154 80.5742 285.154C93.6105 285.154 104.012 275.045 104.012 262.675ZM287.986 168.481C296.034 157.486 306.317 151.988 318.835 151.988C332.174 151.988 342.233 156.273 349.014 164.843C355.795 173.412 359.26 186.065 359.409 202.8V285.627H321.63V203.77C321.63 196.817 320.326 191.724 317.718 188.49C315.11 185.176 310.676 183.518 304.417 183.518C296.667 183.518 291.19 186.186 287.986 191.522V285.627H250.318V172.165C250.424 172.18 250.529 172.195 250.633 172.21V141.52C250.528 141.513 250.423 141.507 250.318 141.501V99.3569H287.986V168.481ZM250.318 141.501C232.964 140.519 223.629 145.683 214.294 153.078C204.904 147.1 191.702 143.645 175.234 143.645C145.973 143.645 126.413 156.155 117.038 171.916L114.694 176.419L113.522 179.796C113.522 179.796 112.351 183.174 112.351 184.299V184.998C111.275 190.443 111.462 196.636 113.163 202.933C116.462 215.148 124.553 224.401 133.446 227.42C124.577 233.576 119.569 242.063 119.569 251.661C119.569 262.954 126.102 270.527 134.404 274.645C124.469 279.561 112.628 286.736 112.628 304.539C112.628 326.328 131.002 340.146 174.826 340.146C224.366 340.146 246.006 322.874 246.006 291.519C246.006 266.142 231.715 250.996 198.643 249.668L167.612 248.339C158.222 248.073 155.772 246.213 155.772 241.298C155.772 238.375 157.405 235.585 160.399 233.193C164.754 233.725 169.246 233.99 174.417 233.99C212.933 233.99 234.437 216.453 234.437 189.216C234.437 182.972 233.076 176.86 230.898 171.679C237.843 170.505 244.788 171.379 250.318 172.165V141.501ZM188.163 287.4C199.732 288.463 202.726 292.714 202.726 298.162C202.726 307.861 193.335 311.581 177.956 311.581C159.31 311.581 151.008 306.399 151.008 295.106C151.008 290.589 152.369 287.267 154.275 284.079L188.163 287.4ZM174.69 208.348C164.21 208.348 159.855 200.244 159.855 188.419C159.855 175.798 164.754 168.756 174.417 168.756C185.169 168.756 189.524 177.658 189.524 189.216C189.524 202.635 183.536 208.348 174.69 208.348Z" fill="inherit"></path> </g>  </symbol>
      <symbol id="logo-domain-kenya" viewBox="0 0 431 424"> <g clip-path="url(#clip2)"> <path fill-rule="evenodd" clip-rule="evenodd" d="M431 212C431 94.7144 334.533 -0.479492 215.375 -0.479492C96.3532 -0.479492 -0.25 94.5805 -0.25 212C-0.25 329.419 96.3532 424.479 215.375 424.479C334.533 424.479 431 329.285 431 212ZM180.954 238.444L170.409 250.126V288H133V98.9998H170.409V199.341L174.183 193.807L202.379 154.95H247.225L205.154 209.67L233.946 254.601C229.982 245.956 228 236.165 228 225.228V221.783C228 208.166 230.502 196.148 235.506 185.73C240.592 175.312 247.975 167.273 257.654 161.613C267.334 155.871 278.818 153 292.107 153C310.811 153 325.576 158.824 336.404 170.472C347.232 182.039 352.646 198.199 352.646 218.953V235.072H270.205C271.682 242.537 274.922 248.402 279.926 252.668C284.93 256.933 291.41 259.066 299.367 259.066C312.492 259.066 322.746 254.472 330.129 245.285L349.078 267.679C343.91 274.816 336.568 280.517 327.053 284.783C317.619 288.967 307.447 291.058 296.537 291.058C276.111 291.058 259.582 284.988 246.949 272.847C245.499 271.445 244.133 269.994 242.849 268.495L255.348 288H212.5L180.954 238.444ZM95.4375 242.604C108.335 242.604 118.875 252.635 118.875 265.208C118.875 277.647 108.474 287.812 95.4375 287.812C82.5399 287.812 72 277.781 72 265.208C72 252.769 82.5399 242.604 95.4375 242.604ZM270.205 209.109C272.502 193.031 279.721 184.992 291.861 184.992C298.424 184.992 303.469 186.838 306.996 190.529C310.523 194.138 312.205 199.265 312.041 205.91V209.109H270.205Z" fill="inherit"></path> </g>  </symbol>
      <symbol id="logo-domain-nigeria" viewBox="0 0 431 424"> <g clip-path="url(#clip3)"> <path fill-rule="evenodd" clip-rule="evenodd" d="M215.375 -0.479492C334.533 -0.479492 431 94.7144 431 212C431 329.285 334.533 424.479 215.375 424.479C96.3532 424.479 -0.25 329.419 -0.25 212C-0.25 94.5805 96.3532 -0.479492 215.375 -0.479492ZM79.4375 234.604C92.3351 234.604 102.875 244.635 102.875 257.208C102.875 269.647 92.4737 279.812 79.4375 279.812C66.5399 279.812 56 269.781 56 257.208C56 244.769 66.5399 234.604 79.4375 234.604ZM369.15 139.572V170.383C363.601 169.583 356.564 168.65 349.526 169.85C351.691 175.052 353.045 181.187 353.045 187.456C353.045 214.8 331.661 232.406 293.361 232.406C288.218 232.406 283.752 232.14 279.421 231.606C276.443 234.007 274.819 236.808 274.819 239.742C274.819 244.678 277.255 246.545 286.594 246.812L317.451 248.145C350.338 249.479 364.548 264.685 364.548 290.161C364.548 321.639 343.03 338.979 293.767 338.979C250.188 338.979 231.917 325.107 231.917 303.232C231.917 285.359 243.691 278.157 253.571 273.221C245.316 269.087 238.819 261.484 238.819 250.146C238.819 239.609 244.774 230.406 255.195 224.137C247.481 219.868 241.797 214.133 238.278 207.064V280.157H193.075V197.594C193.075 180.787 189.015 177.053 180.488 177.053C168.849 177.053 161.135 183.322 161.135 203.596V279.891H115.932V143.173H161.135V163.448C170.744 146.775 184.413 141.84 200.248 141.84C220.278 141.84 230.428 149.976 235.03 163.448C235.842 165.848 236.383 168.249 236.924 170.917C244.233 152.11 265.075 141.706 294.173 141.706C310.549 141.706 323.676 145.174 333.015 151.176C342.353 143.707 351.691 138.505 369.15 139.572ZM321.511 296.83C321.511 291.361 318.534 287.093 307.03 286.026L273.331 282.692C271.436 285.893 270.082 289.227 270.082 293.762C270.082 305.1 278.338 310.302 296.879 310.302C312.173 310.302 321.511 306.567 321.511 296.83ZM278.879 186.656C278.879 198.527 283.21 206.664 293.631 206.664C302.428 206.664 308.383 200.928 308.383 187.456C308.383 175.852 304.052 166.916 293.361 166.916C283.752 166.916 278.879 173.985 278.879 186.656Z" fill="inherit"></path> </g>  </symbol>
      <symbol id="logo-domain-tanzania" viewBox="0 0 431 424"> <g clip-path="url(#clip4)"> <path fill-rule="evenodd" clip-rule="evenodd" d="M431 212.001C431 94.7154 334.533 -0.478516 215.375 -0.478516C96.3532 -0.478516 -0.25 94.5815 -0.25 212.001C-0.25 329.42 96.3532 424.48 215.375 424.48C334.533 424.48 431 329.286 431 212.001ZM121.875 268.209C121.875 255.636 111.335 245.604 98.4375 245.604C85.5399 245.604 75 255.77 75 268.209C75 280.781 85.5399 290.813 98.4375 290.813C111.474 290.813 121.875 280.648 121.875 268.209ZM185.448 124.083V156.92H207.177V185.485H185.448V245.91C185.448 250.874 186.343 254.333 188.134 256.286C189.924 258.239 193.464 259.215 198.754 259.215C202.823 259.215 206.241 258.971 209.008 258.483V287.902C201.602 290.262 193.871 291.442 185.814 291.442C171.654 291.442 161.197 288.105 154.442 281.432C147.688 274.759 144.311 264.627 144.311 251.037V185.485H127.465V156.92H144.311V124.083H185.448ZM332.239 257.262H272.059L330.896 179.137V156.92H222.62V188.659H278.65L220.057 266.051V289H332.239V257.262Z" fill="inherit"></path> </g>  </symbol>
      <symbol id="logo-domain-uganda" viewBox="0 0 431 424"> <g clip-path="url(#clip5)"> <path fill-rule="evenodd" clip-rule="evenodd" d="M431 212.001C431 94.7154 334.533 -0.478516 215.375 -0.478516C96.3532 -0.478516 -0.25 94.5815 -0.25 212.001C-0.25 329.42 96.3532 424.48 215.375 424.48C334.533 424.48 431 329.286 431 212.001ZM88.875 257.209C88.875 244.636 78.3351 234.604 65.4375 234.604C52.5399 234.604 42 244.77 42 257.209C42 269.781 52.5399 279.813 65.4375 279.813C78.4737 279.813 88.875 269.648 88.875 257.209ZM362.555 141.144V173.105C357.018 172.275 349.997 171.306 342.976 172.552C345.136 177.947 346.486 184.312 346.486 190.815C346.486 219.178 325.152 237.441 286.939 237.441C281.808 237.441 277.353 237.164 273.032 236.611C270.061 239.101 268.441 242.007 268.441 245.051C268.441 250.17 270.871 252.107 280.188 252.384L310.974 253.767C343.786 255.151 357.964 270.923 357.964 297.35C357.964 330.002 336.494 347.988 287.345 347.988C243.866 347.988 225.637 333.599 225.637 310.909C225.637 292.369 237.385 284.898 247.242 279.778C239.005 275.489 232.524 267.603 232.524 255.843C232.524 245.847 237.492 237.009 246.292 230.598C237.47 227.453 229.444 217.818 226.171 205.099C225.55 202.689 225.133 200.293 224.906 197.946V189.611C225.016 188.53 225.168 187.472 225.362 186.438V185.694C225.362 184.522 226.524 181.005 226.524 181.005L227.687 177.488L230.012 172.798C239.313 156.385 258.719 143.358 287.75 143.358C304.088 143.358 317.185 146.955 326.502 153.182C335.819 145.434 345.136 140.038 362.555 141.144ZM224.906 189.611V146.637H181.869V242.995C177.722 250.019 170.74 253.532 160.922 253.532C149.496 253.532 143.783 247.65 143.783 235.885V146.637H101V235.631C101 252.051 104.851 264.661 112.553 273.463C120.339 282.181 131.765 286.54 146.83 286.54C162.234 286.54 174.464 280.742 183.52 269.147L184.789 284H224.906V197.946C224.629 195.076 224.637 192.277 224.906 189.611ZM315.025 304.268C315.025 298.595 312.055 294.167 300.577 293.061L266.956 289.602C265.065 292.922 263.715 296.381 263.715 301.085C263.715 312.846 271.952 318.242 290.45 318.242C305.708 318.242 315.025 314.368 315.025 304.268ZM272.492 189.985C272.492 202.298 276.812 210.738 287.21 210.738C295.986 210.738 301.927 204.789 301.927 190.815C301.927 178.778 297.607 169.508 286.939 169.508C277.353 169.508 272.492 176.841 272.492 189.985Z" fill="inherit"></path> </g>  </symbol>
      </svg>
    </div>
    <div id="root" class="h-bg-grey">${body}</div>
    <div class="js-subscribe-push-notification-block b-subscribe-push-notification" data-subscribe="b-subscribe-push-notification__link" data-close="b-subscribe-push-notification__close" data-tracking-url="/web_push/tracking" style="display: none">
      <div class="container h-dflex h-flex-main-center h-flex-cross-center h-height-100p h-pos-rel">
        <span>
          Enable Push notification.
        </span>
        <span class="b-subscribe-push-notification__link">
          Click here
        </span>
        <div class="b-subscribe-push-notification__close"></div>
      </div>
    </div>
    <div class="js-subscribe-push-notification"></div>
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>
    <script>
      function modalAlert(error, func) {
        alert(error);
      }
    </script>
    <script src="/public/vendors~multipleRoutes.js"></script>
    <script src="/public/multipleRoutes.js"></script>
  </body>
</html>
  `;
};
