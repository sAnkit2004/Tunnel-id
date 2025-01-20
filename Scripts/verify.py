import sys
from fuzzy_schnoor_signature.signature import verify_signature
from fuzzy_schnoor_signature.preprocessing import process_biometric

def verify_biometric(biometric_path, public_key):
    # Process the biometric data
    processed_data = process_biometric(biometric_path)
    
    # Verify the biometric signature
    is_valid = verify_signature(processed_data, bytes.fromhex(public_key))
    
    # Return the verification result
    return is_valid

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python verify.py <biometric_file> <public_key>")
        sys.exit(1)
    
    is_valid = verify_biometric(sys.argv[1], sys.argv[2])
    print(str(is_valid).lower())

