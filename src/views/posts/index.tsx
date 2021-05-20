import React from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import IPosts from '../../models/posts';
import IUsers from '../../models/users';
import Swal from 'sweetalert2';

const Posts_Query = gql`
    query MyQuery {
        posts {
        body
        title
            user {
                name
            }
        }
    }
  
`;

const Posts_Add = gql`
    mutation ADD_POST($uid: Int!, $title: bpchar!, $body: String!, $id: Int!) {
        insert_posts(objects: {body: $body, title: $title, uid: $uid, user: {data: {id: $id}}}) {
            returning {
                body
                id
                title
                uid
            }
        }
    }
`;

const User_Query = gql`
    query USERQUERY {
        users {
            id
            name
        }
    }
`;

function Posts(){
    const { loading, error, data } = useQuery(Posts_Query);
    const { loading:loading_user, error:error_user, data:data_user} = useQuery(User_Query);
    const [insert_posts] = useMutation(Posts_Add,{
        refetchQueries:() => [
            { query: Posts_Add }
        ]
    });
    if (loading || loading_user) return <p>Loading...</p>;
    if (error || error_user) return <p>Error :(</p>;


    let tbl = data.posts.map((data:IPosts, index:number) => (
           <tr key={index} className="text-center">
                <td className="border border-black">{ index+=1 }</td>
                <td className="border border-black">{ data.title }</td>
                <td className="border border-black">{ data.body }</td>
                <td className="border border-black">{ data.user.name }</td>
                <td className="border border-black">
                    <button className="border border-black bg-yellow-200 px-4 py-2 rounded">Edit</button>
                    <button className="border border-black bg-red-200 px-4 py-2 rounded">Delete</button>
                </td>
            </tr>
    ));

    let options = data_user.users.map((option:IUsers, index:number) => {
        return `
            <option key="${index}" value="${option.id}">
                ${option.name}
            </option>
        `;
    }); 
        

    let select = `<select class="border border-black px-4 py-2">${options}</select>`;

    

    async function handleAdd(){
        const { value: formValues } = await Swal.fire({
            title: 'Input Artikel',
            html:
              '<div class="flex flex-col">'+
              '<label class="text-left">Title</label>' +
              '<input id="title" class="border border-black px-4 py-2">' +
              '<label class="text-left">Body</label>'+
              '<textarea id="body" class="border border-black px-4 py-2"></textarea>' +
              '<label class="text-left">Name</label>'+
              `${select}`+  
              '</div>',
            focusConfirm: false,
            preConfirm: () => {
               if(
                    (document.getElementById('title') as HTMLInputElement).value && 
                    (document.getElementById('body') as HTMLInputElement).value &&
                    (document.getElementById('name') as HTMLInputElement).value
               ){
                  let title = (document.getElementById("title") as HTMLInputElement).value;
                  let body = (document.getElementById("body") as HTMLInputElement).value;
                  let name = (document.getElementById("name") as HTMLInputElement).value; 
                  return {
                    title, body, name
                  } 
                } else {
                   Swal.showValidationMessage('Silahkan isi Form Terlebih Dahulu')   
                }  
              
            }
          })
          
          if (formValues) {
            let { title, body, name } = formValues;
            insert_posts({variables: {"title": title,"body": body, "uid": name}}).then(res=>{
                Swal.fire("Data Berhasil Di Input");
            }).catch(err=>{
                Swal.fire(err);
            });
          }
    }


    return(
        <div className="flex flex-col">
        <div className="w-full"><button onClick={handleAdd} className="border bg-blue-500 hover:bg-blue-700 px-4 py-2 my-2 mx-2 text-white rounded-xl">Tambah Posting</button></div>
        <div className="w-full h-screen border bg-gray-200">
            <table className="border border-black w-full">
                <thead>
                    <tr>
                        <th className="border border-white w-1/6">ID</th>
                        <th className="border border-white w-1/6">Title</th>
                        <th className="border border-white w-1/2">Body</th>
                        <th className="border border-white w-1/4">Nama</th>
                        <th className="border border-white w-1/3">Action</th>
                    </tr>
                </thead>
                <tbody>
                   {tbl}
                </tbody>
            </table>
        </div>
    </div>
    );
}

export default Posts;