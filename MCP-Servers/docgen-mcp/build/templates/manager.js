import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
// Get current module's path (ES modules compatible)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Navigate to the templates directory relative to the repository root
const TEMPLATES_DIR = path.join(path.dirname(path.dirname(__dirname)), 'templates');
export async function loadTemplate(templateType) {
    try {
        const templatePath = path.join(TEMPLATES_DIR, `${templateType}.template`);
        const templateContent = await fs.readFile(templatePath, 'utf-8');
        return {
            type: templateType,
            content: templateContent,
            sections: parseTemplateSections(templateContent),
            metadata: extractTemplateMetadata(templateContent),
        };
    }
    catch (error) {
        console.error('Error loading template:', error);
        throw new Error(`Template not found: ${templateType}`);
    }
}
export async function listTemplates(category = null) {
    try {
        const files = await fs.readdir(TEMPLATES_DIR);
        const templates = [];
        for (const file of files) {
            if (file.endsWith('.template')) {
                const templateType = file.replace('.template', '');
                const templateInfo = await getTemplateInfo(templateType);
                if (!category || templateInfo.category === category) {
                    templates.push(templateInfo);
                }
            }
        }
        return templates;
    }
    catch (error) {
        console.error('Error listing templates:', error);
        throw error;
    }
}
async function getTemplateInfo(templateType) {
    const template = await loadTemplate(templateType);
    return template.metadata;
}
function parseTemplateSections(templateContent) {
    // Parse template into sections
    // This is a simplified implementation
    const sectionRegex = /{{section:([^}]+)}}/g;
    const matches = Array.from(templateContent.matchAll(sectionRegex));
    return matches.map(match => match[1]);
}
function extractTemplateMetadata(templateContent) {
    // Extract metadata from template comments
    // This is a simplified implementation
    const metadataRegex = /{{metadata:([^}]+):([^}]+)}}/g;
    const matches = Array.from(templateContent.matchAll(metadataRegex));
    const metadata = {};
    for (const match of matches) {
        const key = match[1].trim();
        const value = match[2].trim();
        metadata[key] = value;
    }
    return {
        name: metadata.name || 'Unnamed Template',
        description: metadata.description || '',
        category: metadata.category || 'general',
        requiredSources: metadata.requiredSources ? metadata.requiredSources.split(',') : [],
    };
}
