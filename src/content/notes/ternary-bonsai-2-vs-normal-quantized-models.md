---
title: Ternary Bonsai 2 vs. normal quantized models, tested locally
tags:
  - ai
  - llm
  - quantization
  - benchmarks
  - local-ai
image: null
last_edited: 2026-11-11T21:45:00.000Z
created: 2026-11-11T21:45:00.000Z
---

My brother Steve sent me PrismML's [Bonsai 2 announcement](https://prismml.com/news/bonsai-2-family). These are Qwen models whose weights have been squeezed down to three values, −1, 0 and +1, which works out to about 2 bits per weight. I'd never run a ternary model, so I had Claude Code benchmark the whole family on my desktop against ordinary quantized versions of the same Qwen models: 14 model files, three accuracy benchmarks, plus speed, energy and memory.

The short version: at every size the ternary models are less than half the size of a normal 4-bit quant, generate 1.6 to 1.9 times as fast, and use half the energy per token. They hold up on math and instruction following but lose 7 to 13 points on knowledge questions. They beat a normal 2-bit quant of the same model that's 50% larger. Their shorter thinking is real, but it saves time rather than buying accuracy: give the normal models enough room and they catch up.

![Mean accuracy vs. file size for every model tested](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2026-11-11-ternary-bonsai-benchmarks/image/size-vs-accuracy-dark.png)

## Setup

Everything ran locally on an RTX 4090 and a Ryzen 7800X3D using PrismML's llama.cpp fork (release b12128), which runs both the ternary files and normal GGUFs. The ternary models are PrismML's PQ2_0 files. The baselines are Unsloth's Qwen3.5 GGUFs at Q8_0 (close to full precision), Q4_K_M (the usual default) and IQ2_M (a normal 2-bit quant). Ternary Bonsai 2 27B is built on Qwen3.8 27B, so its baseline is Qwen3.8 27B at Q4_K_M.

- GSM8K: 150 grade-school math problems, thinking on, 8K-token budget. Problems that ran out of budget were rerun with 32K.
- MMLU-Pro: 280 questions across 14 subjects, short step-by-step answers, 4K-token budget.
- IFEval: 200 instruction-following prompts, strict scoring.
- Speed, power and VRAM from llama-bench, plus WikiText-2 perplexity.

Every model saw the same questions with the sampling settings PrismML and Qwen both recommend.

## Speed, energy and memory

![Generation speed on GPU and CPU, and energy per token](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2026-11-11-ternary-bonsai-benchmarks/image/speed-energy-dark.png)

The ternary models are the fastest option at every size, on GPU and on CPU. The 9B generates 272 tokens/s on the 4090 against 152 for Qwen 9B at Q4_K_M and 99 at Q8_0. On CPU alone it manages 18 tokens/s, which is usable for chat. The 27B does 101 tokens/s against 52, and needs about 7.5 GB of VRAM where the 4-bit Qwen 27B needs 16 GB, so it fits on a 12 GB card.

Energy per token roughly halves too: 1.07 J for the ternary 9B against 2.13 for Q4_K_M. PrismML's denser PTQ1_0 packing of the same 9B weights is smaller still (2.0 GB) and a bit faster and cheaper on GPU: 292 tokens/s at 0.8 J per token. The Q2_0 packing, the one stock llama.cpp can also load, came in at 261 tokens/s on the same fork. All three packings gave identical perplexity, so they really are the same weights.

## Thinking tokens

![Mean tokens generated per GSM8K problem](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2026-11-11-ternary-bonsai-benchmarks/image/thinking-tokens-dark.png)

PrismML says the 9B "uses roughly 40% fewer tokens." Against Qwen3.5 9B at Q8_0 I measured 46% fewer on average. Combined with the faster generation, one GSM8K problem took the ternary 9B about 6.6 seconds and 1.9 kJ of GPU energy, against 33 seconds and 9.5 kJ for Q8_0.

The 27B is the exception. Qwen3.8, its base model, already thinks briefly (464 tokens per problem), and the ternary version uses a bit more (627).

![GSM8K accuracy at an 8K vs. 32K thinking budget](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2026-11-11-ternary-bonsai-benchmarks/image/budget-8k-vs-32k-dark.png)

With an 8K budget, the ternary 9B looks like it beats every normal 9B on math: 93% against 84–86%. That's mostly because Qwen3.5 thinks so long that 18 to 21 of its 150 answers run out of room. When I reran those problems with a 32K budget, Qwen 9B rose to 95% and the ternary 9B to 94%. The small models move the same way. So shorter thinking makes the ternary models cheaper and quicker to an answer, but not more accurate on this test.

## Accuracy

| Model | Size | GSM8K | MMLU-Pro | IFEval | GPU tok/s |
|---|---|---|---|---|---|
| **Ternary 2B** | 0.5 GB | 75% | 37% | 66% | 729 |
| Qwen 2B Q4_K_M | 1.3 GB | 68% | 49% | 69% | 456 |
| Qwen 2B Q8_0 | 2.0 GB | 74% | 47% | 62% | 338 |
| **Ternary 4B** | 1.1 GB | 93% | 59% | 77% | 420 |
| Qwen 4B Q4_K_M | 2.7 GB | 91% | 70% | 83% | 245 |
| Qwen 4B Q8_0 | 4.5 GB | 90% | 72% | 81% | 169 |
| **Ternary 9B** | 2.4 GB | 93% | 68% | 78% | 272 |
| Qwen 9B IQ2_M | 3.6 GB | 68% | 66% | 76% | 211 |
| Qwen 9B Q4_K_M | 5.7 GB | 84% | 74% | 82% | 152 |
| Qwen 9B Q8_0 | 9.5 GB | 86% | 75% | 85% | 99 |
| **Ternary 27B** | 7.2 GB | 93% | 72% | 80% | 101 |
| Qwen3.8 27B Q4_K_M | 16.8 GB | 94% | 80% | 80% | 52 |

GSM8K is at the 8K budget; see the chart above for 32K.

The weak spot is knowledge. On MMLU-Pro the ternary models trail their normal counterparts by 8 points at 9B, 13 at 4B, 10 at 2B and 7.5 at 27B. On instruction following they trail by 0 to 7 points; with 200 prompts, only the largest of those gaps is borderline real. The 2B is the weakest of the family overall: 37% on MMLU-Pro, with a third of its answers rambling past 4K tokens.

File size is what you actually trade against, and there the picture splits by size. Under 2 GB the ternary 4B (1.1 GB) has no competition: the normal 2B quants that fit there score 15 points lower on average. At around 2.5 GB, a normal Qwen 4B at Q4_K_M is slightly more accurate than the ternary 9B (81% vs. 80% on average), while the ternary model is faster and thinks less. The normal 2-bit quant of the 9B (IQ2_M) is 50% larger than the ternary 9B and no better on knowledge or instructions. On math it runs out of budget on a third of the problems (68%); with 32K it reaches 92%, but needs 6,600 tokens per problem against the ternary model's 1,800.

Perplexity on WikiText-2 roughly doubles (12.9 for the ternary 9B against 6.5 for Q8_0). The task scores say the ternary model didn't get twice as bad, but it no longer predicts raw web text the way its base model does, so these are not quite the same model as the Qwen they started from.

## Caveats

Each benchmark is a few hundred questions sampled once, so differences of under about 5 points on GSM8K and IFEval, or 6 on MMLU-Pro, are within noise. I didn't test vision, long context, tool use or Apple hardware, which is where PrismML puts much of its pitch. All the speed numbers are single-user. The 32K reruns are fresh attempts at the problems that ran out of room, not exact continuations.
