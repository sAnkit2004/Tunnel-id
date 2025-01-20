import sys
from fuzzy_schnoor_signature.signature import generate_keypair
from fuzzy_schnoor_signature.preprocessing import process_biometric

def main(biometric_path):
    try:
        # Process the biometric data
        processed_data = process_biometric(biometric_path)
        
        # Generate keypair
        public_key, private_key = generate_keypair(processed_data)
        
        # Print keys (will be captured by Node.js)
        print(public_key.hex())
        print(private_key.hex())
        
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python generate_keypair.py <biometric_file>", file=sys.stderr)
        sys.exit(1)
    
    main(sys.argv[1])

