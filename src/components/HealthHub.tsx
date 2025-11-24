
import React from 'react';
import { ArrowRightIcon } from './icons/Icons';

const articles = [
    {
        title: "Understanding Your Blood Pressure Numbers",
        category: "Heart Health",
        imageUrl: "https://picsum.photos/seed/health1/600/400",
        summary: "Learn what the numbers in your blood pressure reading mean and why keeping them in a healthy range is crucial for your long-term health.",
    },
    {
        title: "The Importance of Seasonal Allergy Management",
        category: "Allergies",
        imageUrl: "https://picsum.photos/seed/health2/600/400",
        summary: "Don't let allergies ruin your season. Discover proactive steps you can take to manage symptoms and enjoy the outdoors.",
    },
    {
        title: "Decoding Vitamin Supplements: What Do You Really Need?",
        category: "Nutrition",
        imageUrl: "https://picsum.photos/seed/health3/600/400",
        summary: "The vitamin aisle can be overwhelming. We break down the most common supplements and help you understand which ones might be right for you.",
    },
    {
        title: "A Guide to a Better Night's Sleep",
        category: "Wellness",
        imageUrl: "https://picsum.photos/seed/health4/600/400",
        summary: "Quality sleep is essential for physical and mental health. Explore proven tips and techniques to improve your sleep hygiene.",
    },
];

const ArticleCard: React.FC<typeof articles[0]> = ({ title, category, imageUrl, summary }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
        <div className="p-6">
            <p className="text-sm font-semibold text-primary-teal">{category}</p>
            <h3 className="mt-2 text-xl font-lora font-bold text-text-dark">{title}</h3>
            <p className="mt-3 text-sm text-text-medium">{summary}</p>
        </div>
        <div className="p-6 bg-gray-50">
            <a href="#" className="flex items-center font-semibold text-primary-teal group-hover:underline">
                Read More <ArrowRightIcon className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </a>
        </div>
    </div>
);


const HealthHub: React.FC = () => {
    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-text-dark tracking-tight font-lora">Health & Wellness Hub</h1>
                <p className="mt-3 text-lg text-text-medium max-w-2xl mx-auto">Your trusted source for health information and wellness tips.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {articles.map((article) => (
                    <ArticleCard key={article.title} {...article} />
                ))}
            </div>
        </div>
    );
};

export default HealthHub;
