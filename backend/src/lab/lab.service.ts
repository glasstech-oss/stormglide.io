import { Injectable, Logger, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class LabService {
    private readonly logger = new Logger(LabService.name);
    private aiClient: GoogleGenerativeAI;

    constructor(private readonly prisma: PrismaService) {
        // Initialize the AI client. In production, ensure GEMINI_API_KEY is in your .env
        const apiKey = process.env.GEMINI_API_KEY || 'YOUR_FALLBACK_API_KEY';
        this.aiClient = new GoogleGenerativeAI(apiKey);
    }

    /**
     * Generates a database schema blueprint and architecture strategy from a raw text prompt.
     */
    async generateBlueprint(authorId: string, title: string, rawPrompt: string) {
        // Verify the admin/author exists
        const author = await this.prisma.user.findUnique({ where: { id: authorId } });
        if (!author) throw new NotFoundException('Author not found.');

        this.logger.log(`Initiating AI Blueprint Generation for: ${title}`);

        // The System Prompt: This forces the AI to act as a Senior Systems Architect
        // and strictly return valid JSON so our Next.js frontend can parse and render it beautifully.
        const systemInstruction = `
      You are an elite, world-class Systems Architect. 
      Analyze the following client request and design a robust PostgreSQL database schema using Prisma ORM.
      
      You MUST respond with a raw JSON object and nothing else. Do not include markdown formatting like \`\`\`json.
      
      The JSON structure MUST exactly match this format:
      {
        "proposedTechStack": ["List", "of", "technologies"],
        "architectureSummary": "A brief paragraph explaining the system design.",
        "prismaSchema": "// The raw string containing the Prisma schema models",
        "estimatedComplexity": "Low" | "Medium" | "High" | "Enterprise"
      }
    `;

        try {
            // Initialize the model
            const model = this.aiClient.getGenerativeModel({ model: 'gemini-1.5-pro' });

            // Execute the AI Generation
            const result = await model.generateContent(`${systemInstruction}\n\nCLIENT REQUEST:\n${rawPrompt}`);
            const responseText = result.response.text();

            // Clean the response just in case the AI added markdown backticks
            const cleanedJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

            const aiOutputParsed = JSON.parse(cleanedJsonString);

            // Save the generated blueprint directly into your Command Center Database
            const labNote = await this.prisma.labNote.create({
                data: {
                    authorId,
                    title,
                    markdownContent: rawPrompt,
                    aiSchemaOutput: aiOutputParsed,
                    tags: ['ai-blueprint', 'architecture'],
                },
            });

            this.logger.log(`Blueprint successfully generated and saved. Note ID: ${labNote.id}`);
            return labNote;

        } catch (error) {
            this.logger.error('Failed to generate AI Blueprint', error.stack);
            throw new InternalServerErrorException('The AI engine failed to process the architecture blueprint.');
        }
    }

    /**
     * Retrieves all saved blueprints for your Lab Dashboard
     */
    async getAllBlueprints(authorId: string) {
        return await this.prisma.labNote.findMany({
            where: { authorId },
            orderBy: { createdAt: 'desc' },
        });
    }
}
