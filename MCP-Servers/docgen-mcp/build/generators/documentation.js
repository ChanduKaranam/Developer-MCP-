import { interpolateTemplate } from './interpolation.js';
import { enhanceWithPerplexity } from '../enhancers/perplexity.js';
export async function generateDocumentation(options) {
    try {
        // First pass: basic interpolation of template with data
        let document = await interpolateTemplate(options.template, options.data, options.projectId);
        // Second pass: enhance content with Perplexity
        document = await enhanceWithPerplexity(document, options.data);
        // Format and clean the document
        document = formatDocument(document);
        return document;
    }
    catch (error) {
        console.error('Error generating documentation:', error);
        throw error;
    }
}
function formatDocument(document) {
    // Clean up any remaining template markers
    document = document.replace(/{{[^}]+}}/g, '');
    // Fix double spaces
    document = document.replace(/\s{2,}/g, ' ');
    // Fix empty lines
    document = document.replace(/\n{3,}/g, '\n\n');
    return document;
}
