import React from "react";
import * as checks from "./check";
import { Address, Balance } from "@elrondnetwork/erdjs/out";
import { ConversionTypes } from "./conversionTypes";
import { converters } from "./convertersObjects";
import ResultRow from "./ResultRow";

const ConvertersHandler = () => {
  const [input, setInput] = React.useState("");
  // const [currentConversion, setCurrentConversion] = React.useState("");
  const [isVisible, setIsVisible] = React.useState(false);

  const [displayableResults, setDisplayableResults] = React.useState([]);

  //let displayableResults = [];

  let [divCounter, setDivCounter] = React.useState(0);

  const isBestResult = (result, input) => {
    return (
      displayableResults.filter(
        (res) => res.input === input && res.id < result.id
      ).length === 0
    );
  };

  const displayPossibleResults = (input) => {
    return (
      <div>
        {displayableResults
          .filter((result) => result.input === input)
          .map((result) => {
            if (isBestResult(result, input)) {
              return convertedItem(result.id, result.resultValue, true);
            } else {
              return convertedItem(result.id, result.resultValue, false);
            }
          })}
      </div>
    );
  };

  const displayConversion = () => {
    const inputArray = input.split("@");

    if (inputArray.length === 1) {
      convertWord(inputArray[0]);
      return displayBlock(inputArray[0]);
    } else {
      return (
        <div>
          {inputArray.map((word) => {
            hexConversions(word);
            return displayBlock(word);
          })}
        </div>
      );
    }
  };

  const displayBlock = (word) => {
    return (
      <div style={{ marginTop: "2%" }} key={divCounter++}>
        <div className="container page-content">
          <div className="row">
            <div className="col-9" style={{ marginLeft: "12.5%" }}>
              <div className="transaction-info card">
                <div
                  className="card-header status-text-success"
                  style={{ backgroundColor: "transparent" }}
                >
                  <div className="card-header-item d-flex align-items-center">
                    <span>Possible Conversions for {word}</span>
                  </div>
                </div>
                <div className="card-body p-0">
                  <div className="container-fluid">
                    <div className="tab-content">
                      <div
                        id="transaction-tabs-tabpane-details"
                        aria-labelledby="transaction-tabs-tab-details"
                        role="tabpanel"
                        aria-hidden="false"
                        className="fade tab-pane active show"
                      >
                        <div>{displayPossibleResults(word)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const addToDisplayableResults = (id, resultValue, input) => {
    if (
      displayableResults.some(
        (displayableResult) => displayableResult.id === id
      )
    ) {
      return;
    }

    setDisplayableResults((oldArray) => [
      ...oldArray,
      { id: id, resultValue: resultValue, input: input },
    ]);
  };

  const hexConversions = (hexInput) => {
    if (!hexInput) {
      return;
    }

    tryConvertHexToBech32(hexInput);

    tryConvertHexToDecimal(hexInput);

    tryConvertHexToString(hexInput);

    tryConvertHexToBase64(hexInput);
  };

  const convertWord = (input) => {
    if (!input) {
      return;
    }

    tryConvertBech32ToHex(input);

    tryConvertHexToBech32(input);

    tryConvertDecimalToHex(input);

    tryConvertHexToDecimal(input);

    tryConvertDecimalToBase64(input);

    tryConvertBase64ToDecimal(input);

    tryConvertAmountToDemoninate(input);

    tryConvertDenominatedToAmount(input);

    tryConvertStringToHex(input);

    tryConvertHexToString(input);

    tryConvertStringToBase64(input);

    tryConvertBase64ToString(input);

    tryConvertHexToBase64(input);

    tryConvertBase64ToHex(input);
  };

  const convertedItem = (id, result, isMain) => {
    const label = converters.map((pair) => {
      if (pair.value === id) return pair.label;
      return "";
    });

    if (!result) return "";

    return (
      <div
        key={divCounter++}
        style={{ visibility: isMain ? "visible" : "collapse" }}
      >
        <ResultRow label={label} result={result} isMain={isMain} />
      </div>
    );
  };

  //#region TryConverts

  const tryConvertHexToDecimal = (input) => {
    if (checks.hexadecimal(input)) {
      const result = parseInt(input, 16);

      if (checks.decimal(result)) {
        addToDisplayableResults(ConversionTypes.hexaToDecimal, result, input);
      }
    }
  };

  const tryConvertDecimalToHex = (input) => {
    if (checks.decimal(input)) {
      let result = parseInt(input, 10).toString(16);

      if (result.length % 2 === 1) {
        result = "0" + result;
      }

      if (checks.hexadecimal(result)) {
        addToDisplayableResults(ConversionTypes.decimalToHexa, result, input);
      }
    }
  };

  const tryConvertHexToBech32 = (input) => {
    if (checks.hexAddress(input)) {
      let result;
      try {
        result = new Address(input).bech32();
      } catch {}

      if (result) {
        addToDisplayableResults(ConversionTypes.hexToBech32, result, input);
      }
    }
  };

  const tryConvertBech32ToHex = (input) => {
    if (checks.bech32Address(input)) {
      let result;
      try {
        result = new Address(input).hex();
      } catch {}

      if (result) {
        addToDisplayableResults(ConversionTypes.bech32ToHex, result, input);
      }
    }
  };

  const tryConvertBase64ToHex = (input) => {
    if (checks.base64EncodedString(input)) {
      const result = Buffer.from(input, "base64").toString("hex");

      addToDisplayableResults(
        ConversionTypes.base64ToHexadecimal,
        result,
        input
      );
    }
  };

  const tryConvertHexToBase64 = (input) => {
    if (checks.hexaEncodedString(input)) {
      const result = Buffer.from(input, "hex").toString("base64");

      addToDisplayableResults(
        ConversionTypes.hexadecimalToBase64,
        result,
        input
      );
    }
  };

  const tryConvertBase64ToString = (input) => {
    if (checks.base64EncodedString(input)) {
      const result = Buffer.from(input, "base64").toString("ascii");

      if (checks.stringValue(result)) {
        addToDisplayableResults(ConversionTypes.base64ToString, result, input);
      }
    }
  };

  const tryConvertStringToBase64 = (input) => {
    if (checks.stringValue(input)) {
      const result = Buffer.from(input, "ascii").toString("base64");

      addToDisplayableResults(ConversionTypes.stringToBase64, result, input);
    }
  };

  const tryConvertHexToString = (input) => {
    if (checks.hexaEncodedString(input)) {
      const result = Buffer.from(input, "hex").toString("utf8");

      if (checks.stringValue(result)) {
        addToDisplayableResults(
          ConversionTypes.hexadecimalToString,
          result,
          input
        );
      }
    }
  };

  const tryConvertStringToHex = (input) => {
    if (checks.stringValue(input)) {
      const result = Buffer.from(input, "ascii").toString("hex");

      if (checks.hexadecimal(result)) {
        addToDisplayableResults(
          ConversionTypes.stringToHexadecimal,
          result,
          input
        );
      }
    }
  };

  const tryConvertDenominatedToAmount = (input) => {
    if (checks.denominatedAmount(input)) {
      const result = Balance.fromString(input).toCurrencyString();

      addToDisplayableResults(
        ConversionTypes.denominatedToAmount,
        result,
        input
      );
    }
  };

  const tryConvertAmountToDemoninate = (input) => {
    if (checks.amount(input)) {
      const result = Balance.egld(input).toString();

      addToDisplayableResults(
        ConversionTypes.amountToDenominated,
        result,
        input
      );
    }
  };

  const tryConvertBase64ToDecimal = (input) => {
    if (checks.base64Value(input)) {
      const result = Buffer.from(input, "base64").toString("ascii");

      if (checks.decimal(result)) {
        addToDisplayableResults(ConversionTypes.base64ToDecimal, result, input);
      }
    }
  };

  const tryConvertDecimalToBase64 = (input) => {
    if (checks.decimal(input)) {
      const result = Buffer.from(input, "ascii").toString("base64");

      if (checks.base64Value(result)) {
        addToDisplayableResults(ConversionTypes.decimalToBase64, result, input);
      }
    }
  };

  //#endregion
  return (
    <div>
      <div className="main-search-container py-spacer">
        <div className="container py-3">
          <div className="row">
            <div className="col-12 text-center">
              <h1 className="mb-4"> Elrond Converters</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-lg-9 mx-auto">
              <form className="main-search w-100 d-flex">
                <div className="input-group ">
                  <input
                    type="text"
                    value={input}
                    className="form-control border-0 rounded-pill py-3 pl-3 pl-lg-4 text-truncate"
                    placeholder="Insert a value to be converted."
                    onChange={(event) => {
                      setInput(event.target.value);
                      setDisplayableResults([]);
                      setDivCounter(0);

                      if (event.target.value) {
                        setIsVisible(true);
                      } else {
                        setIsVisible(false);
                      }
                    }}
                  />
                </div>
              </form>
            </div>
          </div>
          <div style={{ display: isVisible ? "block" : "none" }}>
            <div>{displayConversion()}</div>

            {/*Incearaca sa pui blocul intr o componenta si sa aiba props currentWord / displayableResult */}

            {/* <div>{!input.includes("@") ? displayBlock() : ""}</div>
            <div> {input.includes("@") ? displayBlocks(input) : ""}</div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConvertersHandler;