import React from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import IUsers from '../../models/users';
import Swal from 'sweetalert2';

const Users_Query = gql`
        query myQuery {
            users {
                email
                id
                name
            }
        }
`;

const Users_Add = gql`
    mutation ADD_MUTATION($email: bpchar = "", $name: bpchar = "") {
        insert_users(objects: {email: $email, name: $name}) {
            returning {
                email
                id
                name
            }
        }
    }
`;

const Users_Delete = gql`
    mutation DELETE_MUTATION($id: Int!) {
        delete_users_by_pk(id: $id) {
            email
            id
            name
        }
    }
`;

const Users_Update = gql`
    mutation UPDATE_MUTATION($id: Int!, $email: bpchar = "", $name: bpchar = "") {
        update_users_by_pk(pk_columns: {id: $id}, _set: {email: $email, name: $name}) {
            email
            id
            name
        }
    }
`;

function Users(){
    const { loading, error, data } = useQuery(Users_Query);

    const [ insert_users ] = useMutation(Users_Add,{
        refetchQueries:() => [
            { query: Users_Query }
        ]
    });

    const [ delete_users_by_pk, responseUserDeleted ] = useMutation(Users_Delete,{
        refetchQueries:() => [
            { query: Users_Query }
        ]
    });

    const [update_users_by_pk] = useMutation(Users_Update,{
        refetchQueries:() => [
            { query: Users_Query }
        ]
    })
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    let tbl = data.users.map((data:IUsers, index:number) => (
        <tr key={index} className="text-center">
            <td className="border border-black">{index+=1}</td>
            <td className="border border-black">{data.name}</td>
            <td className="border border-black">{data.email}</td>
            <td className="border border-black">
                <button onClick={()=>handleUpdate(data)} className="border border-black bg-yellow-200 px-4 py-2 rounded">Edit</button>
                <button onClick={()=>handleDelete(data.id)} className="border border-black bg-red-200 px-4 py-2 rounded">Delete</button>
            </td>
        </tr>
    ));

    async function handleUpdate(data:IUsers){
        const { value: formValues } = await Swal.fire({
            title: 'Input Email dan Nama',
            html:
              '<div class="flex flex-col">'+
              '<label class="text-left">Nama</label>' +
              '<input id="name" class="border border-black px-4 py-2">' +
              '<label class="text-left">Email</label>'+
              '<input id="email" class="border border-black px-4 py-2">' +
              '</div>',
            focusConfirm: false,
            preConfirm: () => {
               if(
                    (document.getElementById('name') as HTMLInputElement).value && 
                    (document.getElementById('email') as HTMLInputElement).value
               ){
                  var name = (document.getElementById("name") as HTMLInputElement).value;
                  var email = (document.getElementById("email") as HTMLInputElement).value;
                  return {
                    name,email 
                  } 
                } else {
                   Swal.showValidationMessage('Silahkan isi Form Terlebih Dahulu')   
                }  
              
            }
          })
          
          if (formValues) {
            let { name, email } = formValues;
            update_users_by_pk({variables: {"id": data.id, "name": name,"email": email}}).then(res=>{
                Swal.fire("Data Berhasil Di Update");
            }).catch(err=>{
                Swal.fire(err);
            });
          }
    }

    async function handleDelete(isi:number){
        let data = isi;
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
              delete_users_by_pk({variables:{"id":data}}).then(()=>{
                  Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                  )
              }).catch(err=>{
                    Swal.fire(err);
              })
              
            }
          })
    }

    async function handleAdd(){
        const { value: formValues } = await Swal.fire({
            title: 'Input Email dan Nama',
            html:
              '<div class="flex flex-col">'+
              '<label class="text-left">Nama</label>' +
              '<input id="name" class="border border-black px-4 py-2">' +
              '<label class="text-left">Email</label>'+
              '<input id="email" class="border border-black px-4 py-2">' +
              '</div>',
            focusConfirm: false,
            preConfirm: () => {
               if(
                    (document.getElementById('name') as HTMLInputElement).value && 
                    (document.getElementById('email') as HTMLInputElement).value
               ){
                  let name = (document.getElementById("name") as HTMLInputElement).value;
                  let email = (document.getElementById("email") as HTMLInputElement).value
                  return {
                    name,email 
                  } 
                } else {
                   Swal.showValidationMessage('Silahkan isi Form Terlebih Dahulu')   
                }  
              
            }
          })
          
          if (formValues) {
            let { name, email } = formValues;
            insert_users({variables: {"name":name,"email":email}}).then(res=>{
                Swal.fire("Data Berhasil Di Input");
            }).catch(err=>{
                Swal.fire(err);
            });
          }
    }

    return(
        <div className="flex flex-col">
            <div className="w-full">
                <button onClick={handleAdd} className="border bg-blue-500 hover:bg-blue-700 px-4 py-2 my-2 mx-2 text-white rounded-xl">Tambah Users</button>
            </div>
            <div className="w-full h-screen border bg-gray-200">
                <table className="border border-black w-full">
                    <thead>
                        <tr>
                            <th className="border border-white w-1/6">ID</th>
                            <th className="border border-white w-1/3">Name</th>
                            <th className="border border-white w-1/3">Email</th>
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

export default Users;