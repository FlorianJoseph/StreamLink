export async function getUpdateUsers(client: any) {
    const { data, error } = await client
        .from('newsletter_subscriptions')
        .select('email, username')

    if (error) throw createError({ statusCode: 500, message: error.message })

    return data
}