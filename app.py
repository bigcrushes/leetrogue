from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import tempfile
import os
import re

app = Flask(__name__)
# Configure CORS to accept requests from React's development server
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

test_cases = ["\n\nassert Solution(246) == True\nassert Solution(137) == False\n", \
              "\n\nassert Solution(125676521) == True\nassert Solution(1921) == False\nassert Solution(1) == True",\
              "\n\nassert Solution([3,1]) == 2\nassert Solution([2,2,2]) == 7\nassert Solution([3,2,1,5]) == 6", \
              "\n\nassert Solution('babad') == 'aba'\nassert Solution('cbbd') == 'bb'", \
              "\n\nassert Solution([[1,2,1]], 2, 1) == 1\nassert Solution([[2,1,1],[2,3,1],[3,4,1]], 4, 2) == 2\n"]

@app.route('/execute', methods=['POST'])
def execute_code():
    print("Received request") # Debug print
    
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
        
    code = request.json.get('code')
    if not code:
        return jsonify({"error": "No code provided"}), 400
    
    res = {}
    for word in ["if","for","while", "import"]: 
        res[word] = 0
        res[word] = re.findall(rf'\b{word}\b', code)

    print(res)

    if len(res["if"]) > request.json.get('ifloop') or (len(res["for"]) + len(res["while"])) > request.json.get('forloop') or len(res["import"]) > request.json.get('imports'):
        return jsonify({
            'output': "Too many if/for/while/imports!"
        })
    
    print(f"Executing code: {code}") # Debug print
    
    # Create a temporary file to store the code
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
        f.write(code)
        temp_file_path = f.name

        f.write(test_cases[request.json.get('question')])
    
    try:
        # Execute the code and capture output
        result = subprocess.run(
            ['python', temp_file_path], 
            capture_output=True,
            text=True,
            timeout=5
        )
        
        print(f"Output: {result.stdout}") # Debug print
        print(f"Error: {result.stderr}") # Debug print

        if not result.stderr:
            return jsonify({
            'output': "Level passed!",
        })
        
        return jsonify({
            'output': result.stdout,
            'error': result.stderr
        })
        
    except subprocess.TimeoutExpired:
        return jsonify({
            'error': 'Execution timed out (5 seconds limit)'
        })
    except Exception as e:
        print(f"Exception occurred: {str(e)}") # Debug print
        return jsonify({
            'error': str(e)
        })
    finally:
        # Clean up the temporary file
        os.unlink(temp_file_path)

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Backend is running!"})

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True, port=5000)