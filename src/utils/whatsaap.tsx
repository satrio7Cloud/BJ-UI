export const WHATSAPP_NUMBER = "6285156419062"

export const createWhatsappLink = (message?: string) => {
    const base = `https://wa.me/${WHATSAPP_NUMBER}`
    if (!message) return base

    return `${base}?text=${encodeURIComponent(message)}`
}
