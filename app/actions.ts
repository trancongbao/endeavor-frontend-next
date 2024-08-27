'use server'
 
export async function addSubdeck(formData: FormData) {
    console.log('addSubdeck: ', formData.get('addSubdeckInput') as string)
}