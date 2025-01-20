import sys
from fuzzy_schnoor_signature.signature import generate_keypair
from fuzzy_schnoor_signature.preprocessing import process_biometric

def register_biometric(biometric_path):
    # Process the biometric data
    processed_data = process_biometric(biometric_path)
    
    # Generate keypair using the processed biometric data
    public_key, private_key = generate_keypair(processed_data)
    
    # Return the public key and private key
    return public_key.hex(), private_key.hex()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python register.py <biometric_file>")
        sys.exit(1)
    
    public_key, private_key = register_biometric(sys.argv[1])
    print(f"{public_key},{private_key}")

