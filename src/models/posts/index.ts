interface IPosts{
    id:number,
    title:string,
    body:string,
    uid:number,
    user:{
        [ name: string ]: IPosts | string
    }
}

export default IPosts;