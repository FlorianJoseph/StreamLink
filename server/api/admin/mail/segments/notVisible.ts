export async function getNotVisibleUsers(client: any) {
    const { data, error } = await client
        .from('newsletter_not_visible')
        .select('email, username')

    if (error) throw createError({ statusCode: 500, message: error.message })

    return data
}