
class Password {
            constructor() {
                console.log("Welcome to password manager");
                this.pass = "";
                this.history = [];
                this.init();
            }
            
            init() {
                this.resultEl = document.getElementById('result');
                this.clipboardBtn = document.getElementById('clipboard');
                this.generateBtn = document.getElementById('generate');
                this.lengthEl = document.getElementById('length');
                this.uppercaseEl = document.getElementById('uppercase');
                this.lowercaseEl = document.getElementById('lowercase');
                this.numbersEl = document.getElementById('numbers');
                this.symbolsEl = document.getElementById('symbols');
                this.strengthFill = document.getElementById('strength-fill');
                this.strengthText = document.getElementById('strength-text');
                this.historyList = document.getElementById('history-list');
                
               
                this.lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
                this.uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                this.numberChars = "0123456789";
                this.symbolChars = "!@#$%^&*_+";
                
                this.generateBtn.addEventListener('click', () => this.generate());
                this.clipboardBtn.addEventListener('click', () => this.copyToClipboard());
                
                
                this.generate();
            }
            
            generate() {
                const length = parseInt(this.lengthEl.value);
                const hasLower = this.lowercaseEl.checked;
                const hasUpper = this.uppercaseEl.checked;
                const hasNumber = this.numbersEl.checked;
                const hasSymbol = this.symbolsEl.checked;
                
                
                if (!hasLower && !hasUpper && !hasNumber && !hasSymbol) {
                    alert("Please select at least one character type.");
                    return;
                }
                
                if (length < 6) {
                    alert("Password length should be at least 6 characters.");
                    return;
                }
                
                this.pass = this.generatePassword(length, hasLower, hasUpper, hasNumber, hasSymbol);
                
                this.resultEl.textContent = this.pass;
                
               
                this.calculateStrength();
                
                this.addToHistory(this.pass);
            }
            
            generatePassword(length, hasLower, hasUpper, hasNumber, hasSymbol) {
                let charSet = "";
                let password = "";
                
               
                if (hasLower) charSet += this.lowercaseChars;
                if (hasUpper) charSet += this.uppercaseChars;
                if (hasNumber) charSet += this.numberChars;
                if (hasSymbol) charSet += this.symbolChars;
                
                let i = 0;
                while (i < length) {
                    if (hasLower && i < length) {
                        password += this.lowercaseChars[Math.floor(Math.random() * this.lowercaseChars.length)];
                        i++;
                    }
                    if (hasUpper && i < length) {
                        password += this.uppercaseChars[Math.floor(Math.random() * this.uppercaseChars.length)];
                        i++;
                    }
                    if (hasNumber && i < length) {
                        password += this.numberChars[Math.floor(Math.random() * this.numberChars.length)];
                        i++;
                    }
                    if (hasSymbol && i < length) {
                        password += this.symbolChars[Math.floor(Math.random() * this.symbolChars.length)];
                        i++;
                    }
                }
                
                while (password.length < length) {
                    password += charSet[Math.floor(Math.random() * charSet.length)];
                }
                
                return this.shuffleString(password.substring(0, length));
            }
            
            shuffleString(string) {
                const array = string.split('');
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array.join('');
            }
            
            calculateStrength() {
                const password = this.pass;
                let score = 0;
                
                if (password.length >= 8) score += 1;
                if (password.length >= 12) score += 1;
                if (password.length >= 16) score += 1;
                
                const hasLowercase = /[a-z]/.test(password);
                const hasUppercase = /[A-Z]/.test(password);
                const hasNumbers = /[0-9]/.test(password);
                const hasSymbols = /[^a-zA-Z0-9]/.test(password);
                
                let varietyCount = 0;
                if (hasLowercase) varietyCount++;
                if (hasUppercase) varietyCount++;
                if (hasNumbers) varietyCount++;
                if (hasSymbols) varietyCount++;
                
                if (varietyCount >= 2) score += 1;
                if (varietyCount >= 3) score += 1;
                if (varietyCount >= 4) score += 1;
                
                let strengthLevel, strengthColor, strengthPercent;
                
                if (score <= 2) {
                    strengthLevel = "Weak Password";
                    strengthColor = "#ff6b6b";
                    strengthPercent = "33%";
                } else if (score <= 4) {
                    strengthLevel = "Medium Password";
                    strengthColor = "#ffd166";
                    strengthPercent = "66%";
                } else {
                    strengthLevel = "Strong Password";
                    strengthColor = "#06d6a0";
                    strengthPercent = "100%";
                }
                
                this.strengthFill.style.width = strengthPercent;
                this.strengthFill.style.backgroundColor = strengthColor;
                this.strengthText.textContent = strengthLevel;
                this.strengthText.style.color = strengthColor;
            }
            
            copyToClipboard() {
                if (!this.pass) return;
                
                navigator.clipboard.writeText(this.pass).then(() => {
                    const originalText = this.clipboardBtn.textContent;
                    this.clipboardBtn.textContent = "Copied!";
                    
                    setTimeout(() => {
                        this.clipboardBtn.textContent = originalText;
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy password: ', err);
                    alert('Failed to copy password to clipboard');
                });
            }
            
            addToHistory(password) {
                
                this.history.unshift(password);
                
                if (this.history.length > 5) {
                    this.history.pop();
                }
                
                this.updateHistoryUI();
            }
            
            updateHistoryUI() {
                this.historyList.innerHTML = '';
                
                this.history.forEach((password, index) => {
                    const historyItem = document.createElement('div');
                    historyItem.className = 'history-item';
                    
                    const passwordSpan = document.createElement('span');
                    passwordSpan.className = 'history-password';
                    passwordSpan.textContent = password;
                    
                    const copyBtn = document.createElement('button');
                    copyBtn.className = 'history-copy';
                    copyBtn.textContent = 'Copy';
                    copyBtn.addEventListener('click', () => {
                        navigator.clipboard.writeText(password).then(() => {
                            copyBtn.textContent = "Copied!";
                            setTimeout(() => {
                                copyBtn.textContent = "Copy";
                            }, 2000);
                        });
                    });
                    
                    historyItem.appendChild(passwordSpan);
                    historyItem.appendChild(copyBtn);
                    this.historyList.appendChild(historyItem);
                });
            }
        }
        
        document.addEventListener('DOMContentLoaded', () => {
            const passwordGenerator = new Password();
        });