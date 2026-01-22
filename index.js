import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import readline from "readline";

//loads environment variables from .env
dotenv.config();

// Initialize Anthropic client with API key from environment variables
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function main(){
    


    
    // Welcome message
    console.log("Welcome to the AI Secretary CLI!");
    console.log('Type your message and press Enter. Type "exit" to quit.\n');



    // Set up readline interface for user input
    const rl = readline.createInterface({input: process.stdin, output: process.stdout});
    


    // Prompt the user for input
    rl.question("You: ", async (userInput) => {

        // handle exit condition
        if (userInput.toLowerCase() === "exit") {
            console.log("Goodbye!");
            rl.close();
            return;
        }
        
        
        try {
            
            
            
            // Make a request to the Anthropic API
            const message = await anthropic.messages.create({
                model: "claude-sonnet-4-20250514",
                max_tokens: 1024,
                messages: [{ role: "user", content: userInput }]                              
            });



           // Output the response from Claude
           console.log("\nClaude:", message.content[0].text);



           // Close the readline interface
           rl.close();



        } 
        catch (error) {  
            //general error handling          
            console.error("Error:", error.message);
        }
    });

}

main();