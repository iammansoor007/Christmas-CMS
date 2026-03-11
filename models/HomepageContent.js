import mongoose from 'mongoose';

const HomepageContentSchema = new mongoose.Schema({
    // Hero section
    hero: {
        badge: { icon: String, text: String },
        title: { part1: String, part2: String, part3: String },
        subtitle: String,
        backgroundImage: String,
        features: [String],
        cta: { subtext: String, phone: String, availability: String, primary: { text: String, link: String }, secondary: { text: String, link: String } },
        stats: [{ number: String, label: String, icon: String }],
        imageBadge: String,
    },
    // Sections on Homepage
    about: {
        badge: String,
        title: { part1: String, part2: String },
        subtitle: String,
        cta: { title: String, description: String, button: String, phone: String },
    },
    whyChooseUs: {
        badge: String,
        title: { main: String, highlight: String },
        description: String,
        items: [{
            title: String,
            description: String,
            icon: String,
        }],
    },
    howWeWork: {
        badge: String,
        title: { text: String, prefix: String },
        subtitle: String,
        steps: [{
            number: String,
            title: String,
            description: String,
            icon: String,
            color: String,
            features: [String],
        }],
        cta: {
            title: String,
            description: String,
            buttons: { primary: String, secondary: String },
        },
    },
    cta: {
        title: { line1: String, line2: String },
        description: String,
        button: String,
        socialProof: { clients: String, rating: String },
    },
    contact: {
        phone: String,
        email: String,
        address: String,
        hours: String,
    },
    workShowcase: {
        badge: String,
        title: { prefix: String, main: String },
        description: String,
        cta: String,
    },
    // About page specific content
    aboutPage: {
        badge: String,
        title: { part1: String, part2: String },
        subtitle: String,
        founder: {
            name: String,
            role: String,
            quote: String,
            expertise: String,
            philosophy: String,
            tagline: String,
        },
        cta: { title: String, description: String, button: String },
    },
    // Contact page specific content
    contactPage: {
        title: String,
        subtitle: String,
        badge: String,
    },
    faq: [{
        question: String,
        answer: String,
        category: String,
        icon: String,
    }],
    modernServices: [{
        number: String,
        title: String,
        description: String,
        icon: String,
        color: String,
        image: String,
        features: [String],
        stat: String,
    }],
}, { timestamps: true });

export default mongoose.models.HomepageContent ||
    mongoose.model('HomepageContent', HomepageContentSchema);
