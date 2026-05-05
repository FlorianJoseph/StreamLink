import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Img,
    Preview,
    Section,
    Text,
    Row,
    Column,
    Tailwind,
} from "@react-email/components";

const baseUrl = "https://charmi.gg";

interface RebrandEmailProps {
    previewText?: string;    // ex: "T'étais là depuis le début. Voilà la suite."
}

export const RebrandEmail = ({
    username,
    previewText = "T'étais là depuis le début. Voilà la suite.",
}: RebrandEmailProps & { username: string }) => (
    <Html>
        <Head />
        <Preview>{previewText}</Preview>
        <Tailwind
            config={{
                theme: {
                    extend: {
                        colors: {
                            discordBg: "#5865f2",
                            discordText: "#e0e3ff",
                            buttonBg: "#6A5AE0",
                        },
                    },
                },
            }}
        >
            <Body className="font-sans m-0 p-0 bg-[#141416]">
                <Container className="mx-auto max-w-[560px] border border-zinc-800">

                    {/* Header */}
                    <Section className="bg-[#1E1F22] px-8 py-5">
                        <Img
                            src="https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/NewsletterIcon/logo.png"
                            width="120"
                            alt=""
                        />
                    </Section>

                    {/* Hero */}
                    <Section className="bg-[#2A2B2F] p-8">
                        <Text className="text-white text-sm font-semibold mt-0 mb-1">
                            Salut {username},
                        </Text>
                        <Heading className="text-white text-2xl font-bold tracking-tight mt-0 mb-3" style={{ lineHeight: "1.2" }}>
                            StreamLink devient Charmi.
                        </Heading>
                        <Text className="text-zinc-400 text-sm leading-relaxed mt-0 mb-0">
                            T'as été là depuis le début. Tu méritais d'être parmi les premiers à le savoir.
                        </Text>
                    </Section>

                    <Hr className="border-zinc-800 m-0" />

                    {/* Liste des features */}
                    <Section className="px-8 py-7" style={{ backgroundColor: "#1E1F22" }}>
                        <Text className="text-purple-400 text-xs font-semibold uppercase tracking-widest m-0 mb-5">
                            ✦ Ce qui change
                        </Text>

                        {/* Nom */}
                        <Row className="mb-6">
                            <Column className="w-9 align-top pt-0.5">
                                <Img
                                    src="https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/NewsletterIcon/tag.png"
                                    width="24"
                                    alt=""
                                />
                            </Column>
                            <Column className="align-top">
                                <Text className="text-white text-sm font-semibold m-0 mb-1">
                                    Un nouveau nom
                                </Text>
                                <Text className="text-zinc-400 text-xs leading-relaxed m-0">
                                    StreamLink, c'était le point de départ. Charmi, c'est ce qu'on construit vraiment : un compagnon pour les streamers, pas juste un outil.
                                </Text>
                                <Text className="text-zinc-400 text-xs leading-relaxed m-0 mt-1">
                                    Le site est maintenant sur{" "}
                                    <Link href={baseUrl} className="text-purple-400 underline">
                                        charmi.gg
                                    </Link>
                                    . Tous tes liens et ta page restent accessibles.
                                </Text>
                            </Column>
                        </Row>

                        {/* Design */}
                        <Row className="mb-6">
                            <Column className="w-9 align-top pt-0.5">
                                <Img
                                    src="https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/NewsletterIcon/wand-sparkles.png"
                                    width="24"
                                    alt=""
                                />
                            </Column>
                            <Column className="align-top">
                                <Text className="text-white text-sm font-semibold m-0 mb-1">
                                    Une nouvelle identité
                                </Text>
                                <Text className="text-zinc-400 text-xs leading-relaxed m-0">
                                    Interface repensée de A à Z. Plus claire, plus rapide, plus toi.
                                </Text>
                                <Text className="text-zinc-400 text-xs leading-relaxed m-0 mt-1">
                                    Nouvelle palette, nouveaux composants, nouveau dashboard : tout a été retravaillé pour que tu t'y sentes chez toi.
                                </Text>
                            </Column>
                        </Row>

                        {/* Ce qui ne change pas */}
                        <Row className="mb-7">
                            <Column className="w-9 align-top pt-0.5">
                                <Img
                                    src="https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/NewsletterIcon/lock.png"
                                    width="24"
                                    alt=""
                                />
                            </Column>
                            <Column className="align-top">
                                <Text className="text-white text-sm font-semibold m-0 mb-1">
                                    Ce qui reste
                                </Text>
                                <Text className="text-zinc-400 text-xs leading-relaxed m-0">
                                    - Ton compte, tes liens,  ton historique de raids
                                </Text>
                                <Text className="text-zinc-400 text-xs leading-relaxed m-0">
                                    - Ta page publique, accessible comme avant
                                </Text>
                                <Text className="text-zinc-400 text-xs leading-relaxed m-0">
                                    - Ton solde de Charm et ton abonnement si t'as Charmi+
                                </Text>
                            </Column>
                        </Row>

                        {/* CTA principal */}
                        <table width="100%">
                            <tr>
                                <td align="center">
                                    <Button
                                        className="box-border w-full rounded-[8px] bg-buttonBg px-[16px] py-[10px]"
                                        href={`${baseUrl}?utm_source=email&utm_campaign=rebrand`}
                                    >
                                        <span className="text-white text-sm font-semibold">
                                            Découvrir Charmi
                                        </span>
                                    </Button>
                                </td>
                            </tr>
                        </table>
                    </Section>

                    <Hr className="border-zinc-800 m-0" />

                    {/* Discord */}
                    <Section className="px-8 py-7 text-center" style={{ backgroundColor: "#2A2B2F" }}>
                        <Text className="text-white text-sm font-semibold m-0 mb-2">
                            Une question sur le changement ?
                        </Text>
                        <Text className="text-zinc-400 text-sm leading-relaxed mt-2 mb-5">
                            Passe sur Discord, je suis là pour répondre et t'entendre.
                        </Text>
                        <table width="100%">
                            <tr>
                                <td align="center">
                                    <Button
                                        className="box-border w-full rounded-[8px] bg-discordBg px-[16px] py-[8px]"
                                        href="https://discord.gg/fVFguWc76b"
                                    >
                                        <table>
                                            <tr>
                                                <td className="pr-[4px] pt-[2px]">
                                                    <Img
                                                        src="https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/NewsletterIcon/discordWhite.png"
                                                        width="20"
                                                        alt=""
                                                    />
                                                </td>
                                                <td>
                                                    <span className="text-discordText text-sm font-semibold">
                                                        Rejoindre le Discord
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </Button>
                                </td>
                            </tr>
                        </table>
                    </Section>

                    <Hr className="border-zinc-800 m-0" />

                    {/* Footer — citation + signature + désabonnement */}
                    <Section className="px-8 py-6 text-center" style={{ backgroundColor: "#1E1F22" }}>
                        <Text className="text-zinc-400 text-sm leading-relaxed m-0" style={{ fontStyle: "italic" }}>
                            "Keep on streaming."
                        </Text>
                        <Text className="text-zinc-500 text-xs mt-2 mb-4">
                            NordiK, créateur de Charmi
                        </Text>
                        <Hr className="border-zinc-800 mb-4" />
                        <Text className="text-zinc-600 text-xs m-0">
                            Tu reçois cet email car tu as un compte Charmi.{" "}
                        </Text>
                    </Section>

                </Container>
            </Body>
        </Tailwind>
    </Html>
);

export default RebrandEmail;