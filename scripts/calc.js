var Calculator = function() {

	/*
		Controla a exibição da calculadora
	*/
	Calculator.View = function() {

		this.mainCanvas					= document.getElementById("ccanvas");
		this.bufferCanvas				= document.createElement("canvas");
		this.bufferContext				= this.bufferCanvas.getContext("2d");
		this.bufferCanvas.width			= this.mainCanvas.width;
		this.bufferCanvas.height		= this.mainCanvas.height;
		this.highlight					= false;
		this.highlightButton			= undefined;
		this.mouseClicked				= false;
		this.clickedButton				= undefined;
		this.on							= false;
		this.displayData				= "0";

		//cria o placeholder para os botões
		var composition					= new Array();
		this.calcTileMap				= [[.10,1,1,"E"], 
										   [.10,3,.08,"E",.84,"D/D",.08,"E"],
										   [.06,1,1,"E"],
										   [.08,7,.08,"E",.15,"S/On",.08,"E",.15,"F/C",.08,"E",.38,"F/Backspace",.08,"E"],
										   [.06,1,1,"E"],
										   [.08,9,.08,"E",.15,"N/1",.08,"E",.15,"N/2",.08,"E",.15,"N/3",.08,"E",.15,"O/+",.08,"E"],
										   [.06,1,1,"E"],
										   [.08,9,.08,"E",.15,"N/4",.08,"E",.15,"N/5",.08,"E",.15,"N/6",.08,"E",.15,"O/-",.08,"E"],
										   [.06,1,1,"E"],
										   [.08,9,.08,"E",.15,"N/7",.08,"E",.15,"N/8",.08,"E",.15,"N/9",.08,"E",.15,"O/x",.08,"E"],
										   [.06,1,1,"E"],
										   [.08,7,.08,"E",.15,"N/0",.08,"E",.38,"T/=",.08,"E",.15,"O/÷",.08,"E"],
										   [.10,1,1,"E"]];

		this.getComposition = ()			=>	(composition);
		this.getOn = ()						=>	(this.on);
		this.getBufferCanvas = ()			=>	(this.bufferCanvas);
		this.getDisplayData = ()			=>	(this.displayData);
		this.setOff = ()					=>	{	this.on = false; this.resetDisplayData();					}
		this.setOn = ()						=>	{	this.on = true;												}
		this.resetHighLight = ()			=>	{	this.highlight = false; this.highlightButton = undefined;	}
		this.setHighLightButton = (button)	=>	{	this.highlight = true; this.highlightButton = button;		}
		this.resetClickedButton = ()		=>	{	this.mouseClicked = false;									}
		this.setClickedButton = (button)	=>	{	this.mouseClicked = true;									}
		this.setDisplayData = (data)		=>	{	if (this.on) { this.displayData = data;	}					}
		this.resetDisplayData = ()			=>	{	this.displayData = "0";										}

		/* Inicia a view */
		this.init = function() {

			var itemPlaceHolder	= {posX:0, posY:0, width:0, height:0, elementType:undefined, elementValue:undefined, labelValue:undefined};
			var line			= undefined;
			var tempHeight		= undefined;
			var tempElemCount	= undefined;
			var tempX			= undefined;
			var tempY			= 0;
			var tempValue		= undefined;

			for (var lines = 0; lines < 13; lines++) {
				line			= this.calcTileMap[lines];
				tempHeight		= line[0];
				tempElemCount	= line[1];
				tempX			= 0;

				for (var j = 2; j < 20 && (j + 1) <= line.length; j += 2) {
					
					itemPlaceHolder.posY	= tempY;
					itemPlaceHolder.height	= tempHeight;

					if (j % 2 == 0) {
						itemPlaceHolder.posX			= tempX;
						itemPlaceHolder.width			= line[j];
						tempX							= itemPlaceHolder.posX + itemPlaceHolder.width;
						tempValue						= line[j + 1];
						itemPlaceHolder.elementType		= (tempValue.indexOf("/") != -1)?tempValue.split("/")[0]:tempValue;
						itemPlaceHolder.elementValue	= (tempValue.indexOf("/") != -1)?tempValue.split("/")[1]:"";

						//adiciona o objeto na lista
						composition.push(itemPlaceHolder);
						
						//esvazia o placeholder
						itemPlaceHolder = Object.create({});
					}
				}

				tempY += tempHeight;
			}

			this.prerender();
						
		}
		
		//pre-renderiza no backbuffer
		this.prerender = function() {

			console.log("prerender");

			this.bufferContext.strokeStyle	= "#000000";
			this.bufferContext.lineWidth	= 0.2;
			this.bufferContext.font			= "bold" + " " + Math.floor(5/100 * this.bufferCanvas.width) + "px" + " Courier New";
			this.bufferContext.textAlign	= "center";
			this.bufferContext.textBaseline = "middle";
			var tempValue					= undefined;
			
			//renderiza os botões
			for (const item of composition) {
				if (item.elementType != "E") {
					
					if (this.on) {
						if (this.highlight && this.highlightButton != undefined && this.highlightButton == item.elementValue) {
							this.bufferContext.fillStyle = (this.mouseClicked)?"#AADDEE":"#DDDDDD";
						} else {
							this.bufferContext.fillStyle = "#FFFFFF";
						}
					} else {
						if (item.elementType != "S") {
							this.bufferContext.fillStyle = "#EEEEEE";
						} else {
							this.bufferContext.fillStyle = "#FFFFFF";
						}
					}

					this.bufferContext.fillRect(item.posX * this.bufferCanvas.width, item.posY * this.bufferCanvas.height, item.width * this.bufferCanvas.width, item.height * this.bufferCanvas.height);
					this.bufferContext.strokeRect(item.posX * this.bufferCanvas.width, item.posY * this.bufferCanvas.height, item.width * this.bufferCanvas.width, item.height * this.bufferCanvas.height);
					this.bufferContext.fillStyle = "#000000";
					
					if (item.elementType != "D") {
						if (item.elementType == "S") {
							if (this.on)
								tempValue = "Off";
							else
								tempValue = "On";
						} else {
							tempValue = item.elementValue;
						}
						this.bufferContext.fillText(tempValue,
													item.posX * this.bufferCanvas.width + (item.width * this.bufferCanvas.width / 2), 
													item.posY * this.bufferCanvas.height + (item.height * this.bufferCanvas.height / 2) + 2);
					} else {
						if (this.on)
							tempValue = this.displayData;
						else
							tempValue = "";

						this.bufferContext.fillStyle = "#008800";
						this.bufferContext.textAlign = "right";
						this.bufferContext.fillText(tempValue,
													item.posX * this.bufferCanvas.width + (item.width * this.bufferCanvas.width) - (item.width * this.bufferCanvas.width * 0.03), 
													item.posY * this.bufferCanvas.height + (item.height * this.bufferCanvas.height / 2) + 2);
						this.bufferContext.textAlign = "center";
					}
				}
			}
		}

		//renderiza no canvas
		this.render = function() {
			var ctx = this.mainCanvas.getContext("2d");
			ctx.fillStyle = "rgb(180, 200, 220)";
			ctx.fillRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
			ctx.drawImage(this.bufferCanvas, 0, 0);
		}

		//redimenciona o canvas
		this.resize = function() {

			var actualProportion = this.mainCanvas.height / this.mainCanvas.width;

			if (window.innerWidth - 20 < this.mainCanvas.width) {
				this.mainCanvas.width		= window.innerWidth - 20;
				this.mainCanvas.height		= actualProportion * this.mainCanvas.width;
				this.bufferCanvas.width		= this.mainCanvas.width;
				this.bufferCanvas.height	= this.mainCanvas.height;
				this.prerender();
				this.render();
			} 
			
			if (window.innerHeight - 20 < this.mainCanvas.height) {
				this.mainCanvas.height		= window.innerHeight - 20;
				this.mainCanvas.width		= actualProportion * this.mainCanvas.height;
				this.bufferCanvas.width		= this.mainCanvas.width;
				this.bufferCanvas.height	= this.mainCanvas.height;
				this.prerender();
				this.render();
			}
		}

	};

	/*
		Controla a lógica aritimética da calculadora
	*/
	Calculator.Logic = function() {

		this.add = function(valueA, valueB) {
			return (valueA + valueB);
		}

		this.sub = function(valueA, valueB) {
			return (valueA - valueB);
		}

		this.multiply = function(valueA, valueB) {
			return (valueA * valueB);
		}

		this.divide = function(valueA, valueB) {
			return (valueA / valueB);
		}

		this.pow = function(valueA, valueB) {
			return (valueA ** valueB);	
		}

		this.pow2 = function(valueA) {
			return (this.pow(valueA, 2));
		}

		this.pow3 = function(valueA) {
			return (this.pow(valueA, 3));
		}

		this.sqrt = function(valueA) {
			return (Math.sqrt(valueA));
		}

		this.percentage = function(valueA) {
			return (valueA/100);
		}

		this.doMath = function(operation, valueA, valueB) {
			switch (operation) {
					case "+":
					return(this.add(valueA, valueB));
					break;
				case "-":
					return(this.sub(valueA, valueB));
					break;
				case "x":
					return(this.multiply(valueA, valueB));
					break;
				case "÷":
					return(this.divide(valueA, valueB));
					break;
			}
		}
	};

	
	/*
		Controla a interação do usuário com a calculadora
	*/
	Calculator.Interaction = function() {
		this.mousePosX		= 0;
		this.mousePosY		= 0;
		this.mouseXClick	= 0;
		this.mouseYClick	= 0;
		this.view			= undefined;
		this.composition	= undefined;
		this.bufferCanvas	= undefined;
		this.currentElement = undefined;
		this.valueA			= undefined;
		this.valueB			= undefined;
		this.operation		= undefined;
		this.currentStatus	= 0; //0 - valueA || 1 - operator || 2 - valueB
		var tempValue		= undefined;

		this.setView = function(view) {
			this.view			= view;
			this.composition	= this.view.getComposition();
			this.bufferCanvas	= this.view.getBufferCanvas();
		}

		this.setLogic = function(logic) {
			if (this.logic == undefined || this.logic == null) {
				this.logic = logic;
			}
		}


		this.handleMousemove = function(event) {
			this.mousePosX	= event.offsetX;
			this.mousePosY	= event.offsetY;
			var btx			= undefined;
			var bty			= undefined;
			var btw			= undefined;
			var bth			= undefined;

			if (this.view.getOn()) {
				//renderiza os botões
				for (const item of this.composition) {
					if (item.elementType != "E" && item.elementType != "D") {
						btx	= item.posX * this.bufferCanvas.width;
						bty	= item.posY * this.bufferCanvas.height;
						btw	= (item.width * this.bufferCanvas.width) + btx;
						bth	= (item.height * this.bufferCanvas.height) + bty;

						if (this.mousePosX > btx && this.mousePosX < btw && this.mousePosY > bty && this.mousePosY < bth) {
							this.view.setHighLightButton(item.elementValue);
							this.currentElement = item;
							break;
						}					
					} else {
						this.view.resetHighLight();
						this.currentElement = undefined;
					}
				}
				this.view.prerender();
			} else {
				//recupera o botão on
				for (const item of this.composition) {
					if (item.elementType == "S") {
						btx	= item.posX * this.bufferCanvas.width;
						bty	= item.posY * this.bufferCanvas.height;
						btw	= (item.width * this.bufferCanvas.width) + btx;
						bth	= (item.height * this.bufferCanvas.height) + bty;

						if (this.mousePosX > btx && this.mousePosX < btw && this.mousePosY > bty && this.mousePosY < bth) {
							this.view.setHighLightButton(item.elementValue);
							this.currentElement = item;
							this.view.prerender();
						} else {
							this.view.resetHighLight();
							this.currentElement = undefined;
						}
						break;
					}
				}
			}
		}

		this.handleMouseDown = function(event) {

			//informar o view sobre o mouse down para trocar a cor
			this.view.setClickedButton();
			this.view.prerender();
			
		}

		this.handleMouseUp = function(event) {
			//Liga / Desliga
			if (this.currentElement != undefined && this.currentElement.elementType == "S") {
				if (this.view.getOn()) {
					this.view.setOff();
				} else {
					this.view.setOn();
				}
				this.currentStatus = 0;
			}

			if (this.currentElement != undefined) {
				//Limpa o display
				if (this.currentElement.elementType == "F" && this.currentElement.elementValue == "C") {
					this.currentStatus = 0;
					this.view.resetDisplayData();

				//Backspace
				} else if (this.currentElement.elementType == "F" && this.currentElement.elementValue == "Backspace") {
					tempValue = this.view.getDisplayData();
					if (tempValue != "0") {
						tempValue = tempValue.substring(0, tempValue.length - 1);
						if (tempValue.length == 0) {
							tempValue = "0";
						}
					}
					this.view.setDisplayData(tempValue);

					if (this.currentStatus == 0 || this.currentStatus == 1) {
						this.valueA = eval(tempValue);
					} else if (this.currentStatus == 2) {
						this.valueB	= eval(tempValue);
					}

				//Digito de números
				} else if (this.currentElement.elementType == "N") {
					
					if (this.currentStatus == 1) {
						this.view.resetDisplayData();
						this.currentStatus = 2;
					} else if (this.currentStatus == 3) {
						this.view.resetDisplayData();
						this.currentStatus = 0;
					}

					tempValue = this.view.getDisplayData();

					if (tempValue == "0") {
						tempValue = this.currentElement.elementValue;
					} else {
						if (tempValue.length < 10) {
							tempValue += "" + this.currentElement.elementValue;
						}
					}
					this.view.setDisplayData(tempValue);

					if (this.currentStatus == 0) {
						this.valueA = eval(tempValue);
					} else if (this.currentStatus == 2) {
						this.valueB	= eval(tempValue);
					}

				//Digito de Operadores
				} else if (this.currentElement.elementType == "O") {

					if (this.currentStatus == 0 || this.currentStatus == 1) {
						this.operation		= this.currentElement.elementValue;
						this.currentStatus	= 1;
					} else if (this.currentStatus == 3) {
						this.valueA			= eval(this.view.getDisplayData());
						this.valueB			= 0;
						this.currentStatus	= 1;
						this.operation		= this.currentElement.elementValue;
					} else if (this.currentStatus == 2) {
						this.valueA			= this.logic.doMath(this.operation, this.valueA, this.valueB);
						this.valueB			= 0;
						this.currentStatus	= 1;
						this.operation		= this.currentElement.elementValue;
						this.view.setDisplayData(this.valueA + "");
					}

				//Digito de Total (sinal de igual)
				} else if (this.currentElement.elementType == "T") {
					if (this.currentStatus == 2) {
						this.view.setDisplayData(this.logic.doMath(this.operation, this.valueA, this.valueB) + "");
						this.currentStatus	= 3;
					} else if (this.currentStatus == 3) {
						this.valueA	= eval(this.view.getDisplayData());
						this.view.setDisplayData(this.logic.doMath(this.operation, this.valueA, this.valueB) + "");
						this.currentStatus	= 3;
					}
				}
			}

			//informar o view sobre o mouse up para trocar a cor
			this.view.resetClickedButton();
			this.view.prerender();
		}
	};

	/*
		Construtores
	*/
	Calculator.View.prototype			= {		constructor : Calculator.View			};
	Calculator.Logic.prototype			= {		constructor : Calculator.Logic			};
	Calculator.Interaction.prototype	= {		constructor : Calculator.Interaction	};

	/*
		Variáveis membro
	*/
	this.view			= new Calculator.View();
	this.logic			= new Calculator.Logic();
	this.interaction	= new Calculator.Interaction();

	this.view.init();
}

/**/
function main() {

	/* Cria o objeto calculadora */
	var calculator	= new Calculator();
	var FPS			= 1000 / 30;
	var acumulator	= 0;

	/* Renderiza */
	function render() {
		calculator.view.render();
	}

	function resize() {
		calculator.view.resize();
	}

	/* Loop */
	function loop(timeElapsed) {
		acumulator += timeElapsed;
		render();
		if (acumulator >= FPS) {
			acumulator = 0;
			window.requestAnimationFrame(loop);
		}
			
	}

	function mousemove(event) {
		calculator.interaction.setView(calculator.view);
		calculator.interaction.handleMousemove(event);
	}

	function mousedown(event) {
		calculator.interaction.setLogic(calculator.logic);
		calculator.interaction.setView(calculator.view);
		calculator.interaction.handleMouseDown(event);
	}

	function mouseup(event) {
		calculator.interaction.handleMouseUp(event);
	}

	document.getElementById("ccanvas").addEventListener("mousemove", mousemove, true);
	document.getElementById("ccanvas").addEventListener("mousedown", mousedown, true);
	document.getElementById("ccanvas").addEventListener("mouseup", mouseup, true);
	window.addEventListener("resize", resize, true);
	window.requestAnimationFrame(loop);
}