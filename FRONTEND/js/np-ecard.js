class npEcard extends HTMLElement{//<np-ecard>
    constructor(){
        super();
        let shadow = this.attachShadow({mode:"open"});

        //console.log("etag can be used");//debug

        const style = document.createElement("style");//all css style goes here
        style.textContent = ` 
            :host h1,:host h2,:host a, :host img{
                display:none;
            }
        @media only screen and (orientation:landscape) and (hover:none){
            :host h1,:host h2, :host a, :host img{
                display:block;
                color:white;
                margin:2rem;
            }    
            :host{
                    display:block-inline;
                    position:fixed;
                    background-color:#4141AC;
                    border:solid 5vh white;
                    border-left:0;
                    width:100vw;
                    height:90vh;
                    top:0;
                }
            :host img{
                float:right;
                margin:3rem;
            }
        }
        `;

        const pElementArr = this.querySelectorAll("*");//get all elements that were put in by user
        

        shadow.appendChild(style)

        pElementArr.forEach(p=>{//append all elements to shadow dom
            shadow.appendChild(p);
        });
    }
    static counter = 0;
    connectedCallback(){
        npEcard.counter++;
    }
}
window.customElements.define("np-ecard", npEcard);