export async function getAllUsers(client: any) {
    const { data, error } = await client
        .from('all_users_with_email')
        .select('email, username')

    if (error) throw createError({ statusCode: 500, message: error.message })

    return data ?? []
}