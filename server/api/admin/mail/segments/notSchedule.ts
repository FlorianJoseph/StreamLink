export async function getNotScheduleUsers(client: any) {
    const { data, error } = await client
        .from('newsletter_not_schedule')
        .select('email, username')

    if (error) throw createError({ statusCode: 500, message: error.message })

    return data
}