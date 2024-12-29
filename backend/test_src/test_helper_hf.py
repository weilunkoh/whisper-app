from src.helper_hf import load_model_pipeline


def test_load_model_pipeline():
    pipe = load_model_pipeline()
    assert pipe is not None
    assert pipe.model is not None
    assert pipe.tokenizer is not None
    assert pipe.feature_extractor is not None
    assert pipe.torch_dtype is not None
    assert pipe.device is not None
